import { loc, type Localized } from '../../shared/locale';

/**
 * Localized weekday + month tables for the Today-page header date line. The
 * frontend resolves the returned `{uz,ru,en}` leaf to the active locale, so the
 * backend builds all three forms here and never needs to know the caller's
 * language. Forms mirror the `todayMetaFixture.dateLabel` shape:
 *   uz: "Seshanba · 19 May 2026"
 *   ru: "Вторник · 19 мая 2026"
 *   en: "Tuesday · 19 May 2026"
 */
const WEEKDAYS: readonly Localized[] = [
  loc('Yakshanba', 'Воскресенье', 'Sunday'),
  loc('Dushanba', 'Понедельник', 'Monday'),
  loc('Seshanba', 'Вторник', 'Tuesday'),
  loc('Chorshanba', 'Среда', 'Wednesday'),
  loc('Payshanba', 'Четверг', 'Thursday'),
  loc('Juma', 'Пятница', 'Friday'),
  loc('Shanba', 'Суббота', 'Saturday'),
];

/** Month names. The `ru` forms are genitive ("мая") to read correctly after the day number. */
const MONTHS: readonly Localized[] = [
  loc('Yanvar', 'января', 'January'),
  loc('Fevral', 'февраля', 'February'),
  loc('Mart', 'марта', 'March'),
  loc('Aprel', 'апреля', 'April'),
  loc('May', 'мая', 'May'),
  loc('Iyun', 'июня', 'June'),
  loc('Iyul', 'июля', 'July'),
  loc('Avgust', 'августа', 'August'),
  loc('Sentyabr', 'сентября', 'September'),
  loc('Oktyabr', 'октября', 'October'),
  loc('Noyabr', 'ноября', 'November'),
  loc('Dekabr', 'декабря', 'December'),
];

/**
 * Build the localized header date label for a given date. Pure and timezone-
 * agnostic (uses the host local calendar fields), so it is deterministic for a
 * fixed `Date`.
 */
export function dateLabel(date: Date): Localized {
  const weekday = WEEKDAYS[date.getDay()]!;
  const month = MONTHS[date.getMonth()]!;
  const day = date.getDate();
  const year = date.getFullYear();
  return loc(
    `${weekday.uz} · ${day} ${month.uz} ${year}`,
    `${weekday.ru} · ${day} ${month.ru} ${year}`,
    `${weekday.en} · ${day} ${month.en} ${year}`,
  );
}
