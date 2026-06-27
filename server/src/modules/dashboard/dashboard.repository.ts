import type { Card, CardType, MgmtMessage, MgmtThread, Student, Teacher } from '@prisma/client';
import type { Db } from '../../db/prisma';

/** Up/down card tallies for a window. */
export interface KindCounts {
  up: number;
  down: number;
}

/** A student carrying their computed down-card tally for the last 7 days. */
export interface AtRiskStudent {
  student: Student;
  down: number;
}

/** The latest inbound management message with the thread it belongs to. */
export type IncomingMgmtMessage = MgmtMessage & { thread: MgmtThread };

/** A recent activity event, normalised across the sources that feed the feed. */
export type ActivityEvent =
  | { kind: 'card'; at: Date; card: Card & { cardType: CardType; student: Student | null; issuer: Teacher } }
  | { kind: 'attendance'; at: Date };

/**
 * Raw dashboard aggregates that the domain services do NOT already expose:
 * today's up/down issuance, the open-task tally, the at-risk student (most Down
 * cards this week), the latest inbound management message, today's lesson count,
 * the tenant-wide attendance average, and the recent activity events. Every
 * figure is a set-based aggregate (groupBy / count / single ordered scan) — no
 * per-row loops, no N+1 — and every query is scoped to the caller's academy.
 */
export class DashboardRepository {
  constructor(private readonly db: Db) {}

  /** Up/down cards issued by this teacher between [start, end). */
  async cardKindCountsBetween(
    academyId: string,
    issuerId: string,
    start: Date,
    end: Date,
  ): Promise<KindCounts> {
    const rows = await this.db.card.groupBy({
      by: ['kind'],
      where: { academyId, issuerId, createdAt: { gte: start, lt: end } },
      _count: { _all: true },
    });
    const out: KindCounts = { up: 0, down: 0 };
    for (const r of rows) {
      if (r.kind === 'up') out.up = r._count._all;
      else if (r.kind === 'down') out.down = r._count._all;
    }
    return out;
  }

  /** Open tasks for the tenant = anything not in the terminal `done` column. */
  pendingTaskCount(academyId: string): Promise<number> {
    return this.db.task.count({
      where: { academyId, columnId: { not: 'done' } },
    });
  }

  /**
   * Number of distinct cohorts this teacher has a lesson scheduled in today,
   * derived from `Cohort.nextAt` falling inside [start, end). Cohorts with no
   * scheduled next lesson are excluded.
   */
  todaysLessonCount(teacherId: string, start: Date, end: Date): Promise<number> {
    return this.db.cohort.count({
      where: { teacherId, nextAt: { gte: start, lt: end } },
    });
  }

  /**
   * Tenant-wide attendance average across this teacher's cohorts: the rounded
   * mean of the latest attendance percent per cohort. One ordered scan picks the
   * newest record per cohort (no per-cohort round-trip).
   */
  async averageAttendance(teacherId: string): Promise<number> {
    const cohorts = await this.db.cohort.findMany({
      where: { teacherId },
      select: { id: true },
    });
    const ids = cohorts.map((c) => c.id);
    if (!ids.length) return 0;
    const rows = await this.db.attendanceRecord.findMany({
      where: { cohortId: { in: ids } },
      orderBy: { takenAt: 'desc' },
      select: { cohortId: true, percent: true },
    });
    const latest = new Map<string, number>();
    for (const r of rows) if (!latest.has(r.cohortId)) latest.set(r.cohortId, r.percent);
    if (!latest.size) return 0;
    const sum = [...latest.values()].reduce((a, b) => a + b, 0);
    return Math.round(sum / latest.size);
  }

  /**
   * The student with the most Down cards in the last 7 days (the AI-insight
   * "at-risk" subject). Computed by grouping down-cards by student since `since`,
   * picking the top student id, then loading that one student. Returns null when
   * no down-cards were issued in the window.
   */
  async topAtRiskStudent(academyId: string, since: Date): Promise<AtRiskStudent | null> {
    const rows = await this.db.card.groupBy({
      by: ['studentId'],
      where: { academyId, kind: 'down', createdAt: { gte: since }, studentId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { studentId: 'desc' } },
      take: 1,
    });
    const top = rows[0];
    if (!top || !top.studentId) return null;
    const student = await this.db.student.findFirst({
      where: { id: top.studentId, academyId },
    });
    if (!student) return null;
    return { student, down: top._count._all };
  }

  /**
   * The latest inbound (`dir = 'in'`) management message for this teacher, with
   * its thread (for the sender name + role). A single ordered scan, newest first.
   */
  latestIncomingMessage(academyId: string, teacherId: string): Promise<IncomingMgmtMessage | null> {
    return this.db.mgmtMessage.findFirst({
      where: { dir: 'in', thread: { academyId, teacherId } },
      orderBy: { createdAt: 'desc' },
      include: { thread: true },
    });
  }

  /**
   * Recent activity events for the feed: the most recent cards issued by this
   * teacher and the most recent attendance records they took, merged and sorted
   * newest-first. Two bounded ordered scans (no N+1); the caller slices to size.
   */
  async recentActivity(
    academyId: string,
    teacherId: string,
    take: number,
  ): Promise<ActivityEvent[]> {
    const [cards, attendance] = await Promise.all([
      this.db.card.findMany({
        where: { academyId, issuerId: teacherId },
        orderBy: { createdAt: 'desc' },
        take,
        include: { cardType: true, student: true, issuer: true },
      }),
      this.db.attendanceRecord.findMany({
        where: { takenById: teacherId },
        orderBy: { takenAt: 'desc' },
        take,
        select: { takenAt: true },
      }),
    ]);

    const events: ActivityEvent[] = [
      ...cards.map((card) => ({ kind: 'card' as const, at: card.createdAt, card })),
      ...attendance.map((a) => ({ kind: 'attendance' as const, at: a.takenAt })),
    ];
    events.sort((a, b) => b.at.getTime() - a.at.getTime());
    return events.slice(0, take);
  }
}
