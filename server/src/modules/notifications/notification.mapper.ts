import type { Notification } from '@prisma/client';
import { loc, type Localized, type MaybeLocalized } from '../../shared/locale';

/** A notification row projected to the fixture's item shape. */
export interface NotificationItemDto {
  id: string;
  tone: string;
  icon: string;
  title: unknown; // localized {uz,ru,en} (stored Json), passed through
  body: unknown; // localized {uz,ru,en} (stored Json), passed through
  read: boolean;
  time: MaybeLocalized;
}

/** One bucket (Today / Yesterday) with its localized label and items. */
export interface NotificationGroupDto {
  label: Localized;
  items: NotificationItemDto[];
}

/** A computed filter facet with its localized (or plain) label and count. */
export interface NotificationFilterDto {
  label: MaybeLocalized;
  count: number;
  key: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** "HH:MM" in the server's local time — matches the fixture's "today" times. */
function clock(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Weekday short labels per locale; index 0 = Sunday (Date.getDay()).
const WEEKDAYS = {
  uz: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
} as const;

/**
 * "Du · 16:50" localized — matches the fixture's "yesterday" times, where the
 * weekday short-name is prefixed before the clock.
 */
function dayClock(d: Date): Localized {
  const i = d.getDay();
  const hm = clock(d);
  return loc(`${WEEKDAYS.uz[i]} · ${hm}`, `${WEEKDAYS.ru[i]} · ${hm}`, `${WEEKDAYS.en[i]} · ${hm}`);
}

/**
 * Map a row to the item DTO. `today` selects the time representation: today's
 * rows show a bare clock (plain string, as the fixture does); older rows show a
 * localized "<weekday> · HH:MM" leaf.
 */
export function mapNotification(n: Notification, today: boolean): NotificationItemDto {
  return {
    id: n.id,
    tone: n.tone,
    icon: n.icon ?? 'bell',
    title: n.title, // localized — passed through
    body: n.body, // localized — passed through
    read: n.read,
    time: today ? clock(n.createdAt) : dayClock(n.createdAt),
  };
}
