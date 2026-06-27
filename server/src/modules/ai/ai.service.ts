import { NotFoundError } from '../../shared/errors';
import type { AuthContext } from '../../http/plugins/auth';
import { loc } from '../../shared/locale';
import type { AiRepository, StudentRisk } from './ai.repository';
import {
  FallbackAiResponder,
  type IAiResponder,
  type ResponderTurn,
} from './aiResponder';
import {
  mapConversation,
  mapTranscript,
  mapUsage,
  relativeTimeLabel,
  studentCountLabel,
} from './ai.mapper';

/**
 * Static prompt suggestions — there is no per-teacher data source for these, so
 * they are localized constants matching aiPromptsFixture exactly.
 */
const PROMPTS = [
  loc('Haftalik xulosa', 'Недельная сводка', 'Weekly summary'),
  loc('Kim qiynalmoqda?', 'Кому трудно?', 'Who is struggling?'),
  loc('Up karta nomzodlari', 'Кандидаты на Up карту', 'Up card candidates'),
  loc('Ota-onaga xat', 'Письмо родителю', 'Letter to parent'),
];

/** Recent topic chips — localized constants matching aiTopicsFixture. */
const TOPICS = [
  loc('Kvadrat teng.', 'Квадр. уравн.', 'Quadratic eq.'),
  loc('Funksiyalar', 'Функции', 'Functions'),
  loc('Diskriminant', 'Дискриминант', 'Discriminant'),
  loc('Viet form.', 'Формулы Виета', 'Vieta form.'),
  loc('Logarifm', 'Логарифм', 'Logarithm'),
  loc('Tenglamalar', 'Уравнения', 'Equations'),
];

/** AI assistant read + chat use-cases with computed workspace analytics. */
export class AiService {
  private readonly responder: IAiResponder;

  /**
   * `responder` is optional so the composition root can inject the live
   * Anthropic responder when a key is configured; with no responder we default
   * to the offline FallbackAiResponder, which keeps the chat fully functional
   * with zero external dependencies.
   */
  constructor(
    private readonly repo: AiRepository,
    responder: IAiResponder = new FallbackAiResponder(),
  ) {
    this.responder = responder;
  }

  /** GET /ai/usage — token budget with computed percent. */
  async getUsage(ctx: AuthContext) {
    const usage =
      (await this.repo.getUsage(ctx.teacherId)) ?? { used: 0, limit: 50000 };
    return mapUsage({ used: usage.used, limit: usage.limit });
  }

  /**
   * POST /ai/conversations/:id/messages — persist the teacher's message,
   * generate an assistant reply via the responder PORT, persist it, and
   * decrement the token budget — all in one transaction so the exchange and
   * the billing commit atomically. Returns the two messages plus fresh usage
   * so the frontend reconciles its cache without a refetch.
   */
  async sendMessage(ctx: AuthContext, conversationId: string, rawText: string) {
    // Tenancy: the conversation must belong to THIS teacher. Otherwise 404 —
    // never reveal or mutate another teacher's thread.
    const conversation = await this.repo.getOwnedConversation(
      conversationId,
      ctx.academyId,
      ctx.teacherId,
    );
    if (!conversation) throw new NotFoundError('Conversation');

    const text = rawText.trim();

    // Build the prior transcript for the responder from the stored plain
    // outgoing/incoming text (rich analysis messages carry JSON, which we skip
    // as history context rather than replay).
    const prior = await this.repo.listMessages(conversationId);
    const history: ResponderTurn[] = prior
      .map((m) => ({ role: m.role === 'ai' ? 'ai' : 'user', text: plainText(m.text) }) as const)
      .filter((t) => t.text.length > 0);

    const reply = await this.responder.reply(text, history);
    const now = new Date();

    const { userMessage, aiMessage, usageRow } = await this.repo.runInTransaction(
      async (tx) => {
        const userMessage = await this.repo.createMessage(tx, {
          conversationId,
          role: 'user',
          text: JSON.stringify(text),
          tokens: 0,
        });
        const aiMessage = await this.repo.createMessage(tx, {
          conversationId,
          role: 'ai',
          text: JSON.stringify(reply.text),
          tokens: reply.tokens,
        });
        await this.repo.touchConversation(tx, conversationId, now);
        const usageRow = await this.repo.addUsage(tx, ctx.teacherId, reply.tokens);
        return { userMessage, aiMessage, usageRow };
      },
    );

    return {
      userMessage: { id: userMessage.id, role: 'user', text },
      aiMessage: { id: aiMessage.id, role: 'ai', text: reply.text },
      usage: mapUsage({ used: usageRow.used, limit: usageRow.limit }),
    };
  }

  /**
   * DELETE /ai/conversations/:id/messages — clear the transcript of a
   * conversation the teacher owns. Idempotent: clearing an already-empty
   * conversation still returns { ok: true }.
   */
  async clearMessages(ctx: AuthContext, conversationId: string) {
    const conversation = await this.repo.getOwnedConversation(
      conversationId,
      ctx.academyId,
      ctx.teacherId,
    );
    if (!conversation) throw new NotFoundError('Conversation');
    await this.repo.deleteMessages(conversationId);
    return { ok: true as const };
  }

  /** GET /ai/conversations — list with derived sub/time/preview. */
  async listConversations(ctx: AuthContext) {
    const [conversations, active] = await Promise.all([
      this.repo.listConversations(ctx.academyId, ctx.teacherId),
      this.repo.getActiveConversation(ctx.academyId, ctx.teacherId),
    ]);
    const cohortIds = conversations
      .map((c) => c.cohortId)
      .filter((id): id is string => Boolean(id));
    const studentCounts = await this.repo.studentCountByCohort(cohortIds);
    const now = new Date();

    return conversations.map((c) =>
      mapConversation(
        c,
        {
          sub: c.isAll
            ? loc('barcha guruhlar', 'все группы', 'all groups')
            : studentCountLabel(c.cohortId ? (studentCounts.get(c.cohortId) ?? 0) : 0),
          time: relativeTimeLabel(c.lastMessageAt, now),
          // Curated per-conversation summary (AiConversation.preview, Json?).
          preview: (c as { preview?: unknown }).preview ?? loc('', '', ''),
        },
        c.id === active?.id,
      ),
    );
  }

  /**
   * GET /ai/workspace — { prompts, context, attention, topics, transcript }.
   * context/attention are COMPUTED from the active conversation's cohort; the
   * transcript is the active conversation's messages.
   */
  async getWorkspace(ctx: AuthContext) {
    const active = await this.repo.getActiveConversation(ctx.academyId, ctx.teacherId);

    const [context, attention, transcript] = await Promise.all([
      this.buildContext(ctx, active?.cohortId ?? null, active?.name),
      this.buildAttention(active?.cohortId ?? null),
      active ? this.buildTranscript(active.id) : Promise.resolve({}),
    ]);

    return { prompts: PROMPTS, context, attention, topics: TOPICS, transcript };
  }

  /** Active-cohort context rows (group, students, level, attendance, cards, …). */
  private async buildContext(
    ctx: AuthContext,
    cohortId: string | null,
    conversationName: unknown,
  ) {
    const cohort = cohortId ? await this.repo.getCohort(cohortId, ctx.academyId) : null;

    const [students, cards, attendance, tasks, chats] = await Promise.all([
      cohortId
        ? this.repo.studentCountByCohort([cohortId]).then((m) => m.get(cohortId) ?? 0)
        : Promise.resolve(0),
      cohortId ? this.repo.cardCountForCohort(cohortId) : Promise.resolve({ up: 0, down: 0 }),
      cohortId ? this.repo.latestAttendanceForCohort(cohortId) : Promise.resolve(0),
      this.repo.openTaskCount(ctx.academyId, ctx.teacherId),
      this.repo.conversationCount(ctx.academyId, ctx.teacherId),
    ]);

    // The "Group" value mirrors the active conversation's display name. A
    // cohort-bound conversation has a plain string name; pass it through as-is.
    const groupValue = cohort?.name ?? conversationName ?? '';

    return [
      { label: loc('Guruh', 'Группа', 'Group'), value: groupValue },
      { label: loc('O‘quvchilar', 'Ученики', 'Students'), value: String(students) },
      { label: loc('Daraja', 'Уровень', 'Level'), value: cohort?.level ?? loc('—', '—', '—') },
      {
        label: loc('Davomat (oy)', 'Посещ. (месяц)', 'Attendance (month)'),
        value: `${attendance}%`,
        color: 'var(--sf-success)',
      },
      { label: loc('Up kartalar', 'Up карты', 'Up cards'), value: `↑${cards.up}`, color: '#7a4f0e' },
      {
        label: loc('Down kartalar', 'Down карты', 'Down cards'),
        value: `↓${cards.down}`,
        color: 'var(--sf-danger)',
      },
      { label: loc('Topshiriqlar', 'Задачи', 'Tasks'), value: String(tasks) },
      {
        label: loc('AI suhbatlar', 'AI диалоги', 'AI chats'),
        value: loc(`${chats} ta`, `${chats} шт`, `${chats}`),
      },
    ];
  }

  /**
   * Students needing attention: those with at least one down-card OR sub-90%
   * attendance, worst first, with a computed "N Down · M% davomat" reason.
   */
  private async buildAttention(cohortId: string | null) {
    if (!cohortId) return [];
    const risks = await this.repo.studentsAtRisk(cohortId);
    return risks
      .filter((s) => s.down > 0 || s.attendance < 90)
      .sort((a, b) => b.down - a.down || a.attendance - b.attendance)
      .slice(0, 5)
      .map((s) => ({ name: s.name, reason: attentionReason(s) }));
  }

  private async buildTranscript(conversationId: string) {
    const messages = await this.repo.listMessages(conversationId);
    return mapTranscript(messages);
  }
}

/**
 * Reduce a stored message's `text` column to plain history context. Columns
 * hold a JSON-encoded leaf: a plain string, a localized {uz,ru,en} object (use
 * English), or the rich analysis object (no plain form — skipped as '').
 */
function plainText(stored: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return stored;
  }
  if (typeof parsed === 'string') return parsed;
  if (parsed && typeof parsed === 'object' && 'en' in parsed) {
    const en = (parsed as { en: unknown }).en;
    return typeof en === 'string' ? en : '';
  }
  return '';
}

/** Localized "N Down · M% davomat" risk reason. */
function attentionReason(s: StudentRisk) {
  return loc(
    `${s.down} Down · ${s.attendance}% davomat`,
    `${s.down} Down · ${s.attendance}% посещ.`,
    `${s.down} Down · ${s.attendance}% attendance`,
  );
}
