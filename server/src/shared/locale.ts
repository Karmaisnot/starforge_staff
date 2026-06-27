/**
 * Localized text is stored and returned as `{ uz, ru, en }`. The frontend Http
 * adapters resolve it to the active-locale string (mirroring the mock's
 * deepLocalize), so the backend never needs to know the caller's language.
 */
export type Localized = { uz: string; ru: string; en: string };

/** Build a localized value. */
export function loc(uz: string, ru: string, en: string): Localized {
  return { uz, ru, en };
}

/** A value that may be a localized object or a plain (user-typed) string. */
export type MaybeLocalized = Localized | string;
