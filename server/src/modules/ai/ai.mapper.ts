import type { AiConversation, AiMessage } from '@prisma/client';
import { loc, type Localized } from '../../shared/locale';

/** Computed usage with the token-budget percentage (used / limit). */
export interface UsageMetrics {
  used: number;
  limit: number;
}

/** Per-conversation derived display bits the list needs. */
export interface ConversationMeta {
  /** localized "N o'quvchi" student-count subtitle (computed from roster) */
  sub: Localized;
  /** fuzzy relative time of the last message (computed) */
  time: Localized;
  /** curated preview (stored alongside the conversation; localized or plain) */
  preview: unknown;
}

/**
 * Usage DTO — matches aiUsageFixture ({ used, limit }) plus the computed
 * `percent` the header meter reads (used / limit, one decimal). The frontend
 * AiService recomputes the same value, so returning it here is idempotent.
 */
export function mapUsage(metrics: UsageMetrics) {
  const { used, limit } = metrics;
  const percent = limit ? Math.round((used / limit) * 1000) / 10 : 0;
  return { used, limit, percent };
}

/**
 * Conversation DTO — matches aiConversationsFixture entries. `name`, `color`,
 * `pinned`, `isAll`, `active` come from the row; `sub`/`time`/`preview` are
 * derived (sub from the live roster count, time from the last message).
 */
export function mapConversation(conv: AiConversation, meta: ConversationMeta, active: boolean) {
  return {
    id: conv.id,
    name: conv.name, // mixed: localized {uz,ru,en} or plain string
    sub: meta.sub, // localized
    time: meta.time, // localized
    preview: meta.preview, // localized (or plain)
    pinned: conv.pinned,
    active,
    color: conv.color ?? 'var(--sf-primary)',
    isAll: conv.isAll,
  };
}

/** Localized "{n} o'quvchi" student-count subtitle. */
export function studentCountLabel(n: number): Localized {
  return loc(`${n} o‘quvchi`, `${n} ${ruStudents(n)}`, `${n} student${n === 1 ? '' : 's'}`);
}

/** Russian plural for "ученик" (1 ученик / 2-4 ученика / 5+ учеников). */
function ruStudents(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'ученик';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'ученика';
  return 'учеников';
}

/**
 * Fuzzy relative-time label for the conversation list (e.g. "Bugun · 11:34",
 * "Kecha", "3 kun"). Computed from the last-message timestamp so the list
 * mirrors the fixture's time leaves without storing stale strings.
 */
export function relativeTimeLabel(at: Date | null, now: Date = new Date()): Localized {
  if (!at) return loc('—', '—', '—');
  const dayDiff = startOfDayDiff(at, now);
  if (dayDiff <= 0) {
    const hh = String(at.getHours()).padStart(2, '0');
    const mm = String(at.getMinutes()).padStart(2, '0');
    const clock = `${hh}:${mm}`;
    return loc(`Bugun · ${clock}`, `Сегодня · ${clock}`, `Today · ${clock}`);
  }
  if (dayDiff === 1) return loc('Kecha', 'Вчера', 'Yesterday');
  return loc(`${dayDiff} kun`, `${dayDiff} ${ruDays(dayDiff)}`, `${dayDiff} day${dayDiff === 1 ? '' : 's'}`);
}

/** Whole-day difference between two dates (calendar days, not 24h windows). */
function startOfDayDiff(at: Date, now: Date): number {
  const a = new Date(at.getFullYear(), at.getMonth(), at.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}

/** Russian plural for "день" (1 день / 2-4 дня / 5+ дней). */
function ruDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'дня';
  return 'дней';
}

/**
 * Transcript DTO — the structured `aiTranscriptFixture` for the active
 * conversation. The reply is a rich analysis card; the seeded AiMessages carry
 * its JSON in their `text` column (role 'user' messages are plain outgoing
 * strings, the single role 'ai' message holds the serialized rich reply).
 */
export function mapTranscript(messages: AiMessage[]) {
  // Empty transcript (no active conversation / no messages) -> empty object,
  // mirroring the mock returning the canned object only when data exists.
  const outgoing = messages.filter((m) => m.role === 'user');
  const reply = messages.find((m) => m.role === 'ai');
  if (!reply || outgoing.length < 2) return {};
  return {
    outgoing1: parseLeaf(outgoing[0]!.text),
    reply: JSON.parse(reply.text),
    outgoing2: parseLeaf(outgoing[1]!.text),
  };
}

/** A message's text is a JSON-encoded localized leaf (or plain string). */
function parseLeaf(text: string): Localized | string {
  try {
    const parsed = JSON.parse(text);
    return parsed as Localized | string;
  } catch {
    return text;
  }
}
