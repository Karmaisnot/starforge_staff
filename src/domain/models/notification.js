import { NotificationTone } from '../enums.js';

/**
 * @typedef {Object} NotificationItem
 * @property {'ai'|'primary'|'accent'|'success'|'warn'|'neutral'} tone
 * @property {string} icon   icon name, or 'AI' for the AI mark
 * @property {string} title
 * @property {string} body
 * @property {string} time
 */

/**
 * @typedef {Object} NotificationGroup
 * @property {string} label
 * @property {NotificationItem[]} items
 */

/** @param {Partial<NotificationItem>} data @returns {NotificationItem} */
export function createNotification(data = {}) {
  return {
    tone: data.tone ?? NotificationTone.NEUTRAL,
    icon: data.icon ?? 'bell',
    title: data.title ?? '',
    body: data.body ?? '',
    time: data.time ?? '',
  };
}

/** Visual palette for a notification tone. */
export function notificationToneStyle(tone) {
  const map = {
    ai: { bg: 'var(--sf-ai-bg)', fg: 'var(--sf-ai)', border: 'var(--sf-ai-border)' },
    primary: { bg: 'var(--sf-primary-soft)', fg: 'var(--sf-primary-ink)', border: 'transparent' },
    accent: { bg: 'var(--sf-accent-soft)', fg: 'var(--sf-accent-ink)', border: 'transparent' },
    success: { bg: 'var(--sf-success-soft)', fg: 'var(--sf-success)', border: 'transparent' },
    warn: { bg: 'var(--sf-warn-soft)', fg: 'var(--sf-warn)', border: 'transparent' },
    neutral: { bg: 'var(--sf-surface-2)', fg: 'var(--sf-ink-2)', border: 'transparent' },
  };
  return map[tone] ?? map.neutral;
}
