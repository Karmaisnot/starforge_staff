import type { Prisma } from '@prisma/client';
import type { Db } from '../../db/prisma';

/** The Prisma client surface shared by the base client and a $transaction tx. */
type DbClient = Db | Prisma.TransactionClient;

export interface KindCounts {
  up: number;
  down: number;
}

/** A student with its computed down-card tally and attendance % (attention list). */
export interface StudentRisk {
  id: string;
  name: string;
  down: number;
  attendance: number;
}

/**
 * AI assistant data access. Conversations + usage are read directly; the
 * workspace's context/attention metrics are produced with set-based groupBy
 * aggregates (student counts, up/down cards, attendance) — never per-row loops —
 * so the analysis stays a constant number of queries regardless of roster size.
 */
export class AiRepository {
  constructor(private readonly db: Db) {}

  /** Conversations for this teacher, pinned first then most-recent activity. */
  listConversations(academyId: string, teacherId: string) {
    return this.db.aiConversation.findMany({
      where: { academyId, teacherId },
      orderBy: [{ pinned: 'desc' }, { lastMessageAt: 'desc' }, { createdAt: 'asc' }],
    });
  }

  /** Per-teacher token usage (seeded row). */
  getUsage(teacherId: string) {
    return this.db.aiUsage.findUnique({ where: { teacherId } });
  }

  /** The conversation currently open for this teacher (active flag pointer). */
  async getActiveConversation(academyId: string, teacherId: string) {
    const teacher = await this.db.teacher.findFirst({
      where: { id: teacherId, academyId },
      select: { activeAiConversationId: true },
    });
    const activeId = teacher?.activeAiConversationId;
    if (activeId) {
      const active = await this.db.aiConversation.findFirst({
        where: { id: activeId, academyId, teacherId },
      });
      if (active) return active;
    }
    // Fall back to the first conversation (mirrors the frontend's `?? all[0]`).
    return this.db.aiConversation.findFirst({
      where: { academyId, teacherId },
      orderBy: [{ pinned: 'desc' }, { lastMessageAt: 'desc' }, { createdAt: 'asc' }],
    });
  }

  /** Messages of one conversation in chronological order (the transcript). */
  listMessages(conversationId: string, client: DbClient = this.db) {
    return client.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Fetch a conversation scoped to its owning teacher/academy. Returns null if
   * it does not exist within the tenant (so the service can raise NotFound and
   * never act on another teacher's conversation).
   */
  getOwnedConversation(conversationId: string, academyId: string, teacherId: string) {
    return this.db.aiConversation.findFirst({
      where: { id: conversationId, academyId, teacherId },
    });
  }

  /**
   * Run a unit of work inside a single Prisma transaction. The service composes
   * the user-message insert, assistant-message insert and usage decrement here
   * so they commit atomically (no half-written exchange, no double-billed
   * usage). The callback receives the tx-scoped client to thread through.
   */
  runInTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }

  /** Append one message to a conversation (role 'user' | 'ai'). */
  createMessage(
    client: DbClient,
    data: { conversationId: string; role: 'user' | 'ai'; text: string; tokens: number },
  ) {
    return client.aiMessage.create({ data });
  }

  /** Stamp the conversation's last-activity time so the list re-sorts. */
  touchConversation(client: DbClient, conversationId: string, at: Date) {
    return client.aiConversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: at },
    });
  }

  /** Remove every message of a conversation (the "clear chat" action). */
  deleteMessages(conversationId: string, client: DbClient = this.db) {
    return client.aiMessage.deleteMany({ where: { conversationId } });
  }

  /**
   * Atomically decrement remaining budget by `tokens`, clamped at the limit so
   * `used` never exceeds `limit`. Upserts the per-teacher row if missing so a
   * teacher with no seeded usage still bills correctly. Returns the new row.
   */
  async addUsage(client: DbClient, teacherId: string, tokens: number) {
    const existing = await client.aiUsage.findUnique({ where: { teacherId } });
    if (!existing) {
      return client.aiUsage.create({
        data: { teacherId, used: Math.min(tokens, 50000), limit: 50000 },
      });
    }
    const used = Math.min(existing.used + tokens, existing.limit);
    return client.aiUsage.update({ where: { teacherId }, data: { used } });
  }

  getCohort(cohortId: string, academyId: string) {
    return this.db.cohort.findFirst({ where: { id: cohortId, academyId } });
  }

  /** Live student headcount per cohort (set-based; no N+1). */
  async studentCountByCohort(cohortIds: string[]): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    if (!cohortIds.length) return out;
    const rows = await this.db.student.groupBy({
      by: ['cohortId'],
      where: { cohortId: { in: cohortIds } },
      _count: { _all: true },
    });
    for (const r of rows) if (r.cohortId) out.set(r.cohortId, r._count._all);
    return out;
  }

  /** Up/down card tallies for one cohort (single groupBy). */
  async cardCountForCohort(cohortId: string): Promise<KindCounts> {
    const rows = await this.db.card.groupBy({
      by: ['kind'],
      where: { cohortId },
      _count: { _all: true },
    });
    const counts: KindCounts = { up: 0, down: 0 };
    for (const r of rows) {
      if (r.kind === 'up') counts.up = r._count._all;
      else if (r.kind === 'down') counts.down = r._count._all;
    }
    return counts;
  }

  /** Latest attendance % for a cohort (most recent record). */
  async latestAttendanceForCohort(cohortId: string): Promise<number> {
    const record = await this.db.attendanceRecord.findFirst({
      where: { cohortId },
      orderBy: { takenAt: 'desc' },
      select: { percent: true },
    });
    return record?.percent ?? 0;
  }

  /** Open (todo/doing/review) task count for the teacher — the "Tasks" stat. */
  openTaskCount(academyId: string, teacherId: string) {
    return this.db.task.count({
      where: { academyId, ownerId: teacherId, columnId: { not: 'done' } },
    });
  }

  /** AI conversation count for the teacher — the "AI chats" stat. */
  conversationCount(academyId: string, teacherId: string) {
    return this.db.aiConversation.count({ where: { academyId, teacherId } });
  }

  /**
   * Students of a cohort ranked by risk (most down-cards, lowest attendance)
   * for the "needs attention" card. Down-card and attendance aggregates are
   * each one set-based query keyed by studentId — no per-student loop.
   */
  async studentsAtRisk(cohortId: string): Promise<StudentRisk[]> {
    const students = await this.db.student.findMany({
      where: { cohortId },
      select: { id: true, name: true },
      orderBy: { createdAt: 'asc' },
    });
    if (!students.length) return [];
    const ids = students.map((s) => s.id);

    const [downRows, attTotals, attPresent] = await Promise.all([
      this.db.card.groupBy({
        by: ['studentId'],
        where: { studentId: { in: ids }, kind: 'down' },
        _count: { _all: true },
      }),
      this.db.attendanceEntry.groupBy({
        by: ['studentId'],
        where: { studentId: { in: ids } },
        _count: { _all: true },
      }),
      this.db.attendanceEntry.groupBy({
        by: ['studentId'],
        where: { studentId: { in: ids }, present: true },
        _count: { _all: true },
      }),
    ]);

    const downMap = new Map<string, number>();
    for (const r of downRows) if (r.studentId) downMap.set(r.studentId, r._count._all);
    const totalMap = new Map<string, number>();
    for (const r of attTotals) totalMap.set(r.studentId, r._count._all);
    const presentMap = new Map<string, number>();
    for (const r of attPresent) presentMap.set(r.studentId, r._count._all);

    return students.map((s) => {
      const total = totalMap.get(s.id) ?? 0;
      const present = presentMap.get(s.id) ?? 0;
      return {
        id: s.id,
        name: s.name,
        down: downMap.get(s.id) ?? 0,
        attendance: total ? Math.round((present / total) * 100) : 0,
      };
    });
  }
}
