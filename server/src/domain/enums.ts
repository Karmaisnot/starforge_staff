// Closed vocabularies the backend validates against. Mirrors the frontend's
// src/domain/enums.js so both ends share one source of truth for these strings.
// (SQLite has no native enum, so these are String columns validated here.)

export const CardKind = Object.freeze({ UP: 'up', DOWN: 'down' });
export const TaskColumnId = Object.freeze({ TODO: 'todo', DOING: 'doing', REVIEW: 'review', DONE: 'done' });
export const Priority = Object.freeze({ P1: 'P1', P2: 'P2', P3: 'P3' });
export const PrinterStatus = Object.freeze({ FREE: 'free', BUSY: 'busy', LOCKED: 'locked' });
export const PrintJobState = Object.freeze({ NOW: 'now', QUEUED: 'queued' });
export const AiRole = Object.freeze({ USER: 'user', AI: 'ai' });
export const SurveyResponseStatus = Object.freeze({ SUBMITTED: 'submitted', SKIPPED: 'skipped' });
export const MgmtDir = Object.freeze({ IN: 'in', OUT: 'out', CARD: 'card' });
export const NotificationTone = Object.freeze({
  AI: 'ai',
  PRIMARY: 'primary',
  ACCENT: 'accent',
  SUCCESS: 'success',
  WARN: 'warn',
  NEUTRAL: 'neutral',
});
export const MaterialKind = Object.freeze({ PDF: 'pdf', VIDEO: 'video', DOC: 'doc' });
export const StudentFlag = Object.freeze({ TOP: 'top', WARN: 'warn' });
export const Palette = Object.freeze({ SAROY: 'saroy', MARVARID: 'marvarid', SAMARQAND: 'samarqand', DARYO: 'daryo' });
export const Locale = Object.freeze({ UZ: 'uz', RU: 'ru', EN: 'en' });
export const Platform = Object.freeze({ WEB: 'web', MOBILE: 'mobile', DESKTOP: 'desktop' });

export const LOCALES = ['uz', 'ru', 'en'] as const;
export const DEFAULT_LOCALE = 'uz';
