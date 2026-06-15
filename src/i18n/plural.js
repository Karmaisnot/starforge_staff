// Counted-noun pluralization, selected per locale via Intl.PluralRules.
//
// A flat dictionary string cannot satisfy Slavic plural agreement: Russian needs
// "1 ученик / 24 ученика / 19 учеников" depending on the number. So pluralized
// nouns live here (not in the locale dicts) and are resolved against the count.
// Uzbek does not inflect a noun after a numeral, so its forms collapse to one.

const NOUN_FORMS = {
  students: {
    uz: { other: "o'quvchi" },
    ru: { one: 'ученик', few: 'ученика', many: 'учеников', other: 'ученика' },
    en: { one: 'student', other: 'students' },
  },
  pages: {
    uz: { other: 'sahifa' },
    ru: { one: 'страница', few: 'страницы', many: 'страниц', other: 'страницы' },
    en: { one: 'page', other: 'pages' },
  },
  files: {
    uz: { other: 'fayl' },
    ru: { one: 'файл', few: 'файла', many: 'файлов', other: 'файла' },
    en: { one: 'file', other: 'files' },
  },
  questions: {
    uz: { other: 'savol' },
    ru: { one: 'вопрос', few: 'вопроса', many: 'вопросов', other: 'вопроса' },
    en: { one: 'question', other: 'questions' },
  },
  views: {
    uz: { other: "ko'rildi" },
    ru: { one: 'просмотр', few: 'просмотра', many: 'просмотров', other: 'просмотра' },
    en: { one: 'view', other: 'views' },
  },
};

const rulesCache = {};

function pluralRules(locale) {
  if (!rulesCache[locale]) {
    try {
      rulesCache[locale] = new Intl.PluralRules(locale);
    } catch {
      rulesCache[locale] = new Intl.PluralRules('en');
    }
  }
  return rulesCache[locale];
}

/**
 * Pick the correct plural form of a counted noun for the active locale.
 * @param {string} locale - active locale code (uz | ru | en)
 * @param {string} key - noun key registered in NOUN_FORMS
 * @param {number} count - the quantity that governs the form
 * @returns {string} the noun in the form that agrees with `count`
 */
export function plural(locale, key, count) {
  const forms = NOUN_FORMS[key]?.[locale] ?? NOUN_FORMS[key]?.en ?? {};
  const category = pluralRules(locale).select(Math.abs(Number(count) || 0));
  return forms[category] ?? forms.other ?? Object.values(forms)[0] ?? key;
}
