// Locale plumbing shared between React (I18nProvider) and the non-React data layer.
// A module-level holder lets mock repositories localize fixtures without needing
// React context; I18nProvider keeps it in sync and bumps data refetches via deps.

export const LOCALES = ['uz', 'ru', 'en'];
export const DEFAULT_LOCALE = 'uz';
export const STORAGE_KEY = 'sf-locale';

let current = DEFAULT_LOCALE;

export function getLocale() {
  return current;
}

export function setLocaleHolder(locale) {
  current = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

export function readStoredLocale() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return LOCALES.includes(raw) ? raw : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/** A localizable leaf is a plain object whose keys are a subset of LOCALES. */
function isLocalizable(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => LOCALES.includes(k));
}

/** Resolve a single field: `{uz,ru,en}` → string for locale; otherwise unchanged. */
export function tr(value, locale = current) {
  if (isLocalizable(value)) return value[locale] ?? value[DEFAULT_LOCALE] ?? '';
  return value;
}

/** Deep-clone `data`, replacing every localizable leaf with its `locale` string. */
export function deepLocalize(data, locale = current) {
  if (isLocalizable(data)) return tr(data, locale);
  if (Array.isArray(data)) return data.map((v) => deepLocalize(v, locale));
  if (data && typeof data === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(data)) out[k] = deepLocalize(v, locale);
    return out;
  }
  return data;
}
