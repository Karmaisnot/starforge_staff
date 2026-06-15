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
