import type { Card, CardType, Cohort, Student, Teacher } from '@prisma/client';
import { loc, type Localized } from '../../shared/locale';

/** A recent card joined with the relations the row DTO needs. */
export type RecentCardRow = Card & {
  cardType: CardType;
  student: Student | null;
  cohort: Cohort | null;
  issuer: Teacher;
};

/** Computed aggregate stats for the cards page header. */
export interface CardStats {
  upThisWeek: number;
  downThisWeek: number;
  recipients: number;
  typeCount: number;
  upTrend: string;
}

/** The catalogue/version label the UI shows next to the type count (display-only). */
export const CARD_TYPE_VERSION = 'v2.3';

const WEEKDAYS: readonly Localized[] = [
  loc('Yak', 'Вс', 'Sun'),
  loc('Dush', 'Пн', 'Mon'),
  loc('Sesh', 'Вт', 'Tue'),
  loc('Chor', 'Ср', 'Wed'),
  loc('Pay', 'Чт', 'Thu'),
  loc('Jum', 'Пт', 'Fri'),
  loc('Shan', 'Сб', 'Sat'),
];

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Derive the fixture's `when` label from a card's createdAt: a bare "HH:MM" when
 * issued today, otherwise a localized "<weekday> · HH:MM" leaf (matching the
 * fixture's "Dush · 14:20" / "Yak · 18:40" forms). Returned as `{uz,ru,en}` so
 * the frontend localizes the weekday; for same-day all three share the time.
 */
export function whenLabel(createdAt: Date, now: Date = new Date()): Localized {
  const hm = `${pad(createdAt.getHours())}:${pad(createdAt.getMinutes())}`;
  const sameDay =
    createdAt.getFullYear() === now.getFullYear() &&
    createdAt.getMonth() === now.getMonth() &&
    createdAt.getDate() === now.getDate();
  if (sameDay) return loc(hm, hm, hm);
  const day = WEEKDAYS[createdAt.getDay()]!;
  return loc(`${day.uz} · ${hm}`, `${day.ru} · ${hm}`, `${day.en} · ${hm}`);
}

/** Teacher full name -> initials with dots, e.g. "Nigora Karimova" -> "N.K.". */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  return parts.map((p) => `${p[0]!.toUpperCase()}.`).join('');
}

/** Recent-card DTO — matches recentCardsFixture entries field-for-field. */
export function mapRecentCard(card: RecentCardRow, now?: Date) {
  return {
    id: card.id,
    recipient: card.student?.name ?? '', // plain user name
    cohort: card.cohort?.name ?? '', // plain, e.g. "9-B Algebra"
    typeName: card.cardType.name, // localized {uz,ru,en}
    kind: card.kind, // 'up' | 'down'
    reason: card.reason ?? '', // localized {uz,ru,en} or plain string
    issuer: initials(card.issuer.name), // e.g. "N.K."
    when: whenLabel(card.createdAt, now), // localized HH:MM / weekday label
  };
}

/** Card-type DTO with computed count — matches cardTypesFixture entries. */
export function mapCardType(type: CardType, count: number) {
  return {
    id: type.id,
    name: type.name, // localized {uz,ru,en}
    subtitle: type.subtitle, // localized {uz,ru,en}
    kind: type.kind, // 'up' | 'down'
    count, // computed: number of cards of this type
  };
}

/** Stats DTO — matches cardStatsFixture (typeVersion is the display constant). */
export function mapCardStats(stats: CardStats) {
  return {
    upThisWeek: stats.upThisWeek,
    downThisWeek: stats.downThisWeek,
    recipients: stats.recipients,
    typeCount: stats.typeCount,
    typeVersion: CARD_TYPE_VERSION,
    upTrend: stats.upTrend,
  };
}
