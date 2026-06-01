/**
 * @typedef {Object} AiConversation
 * @property {number} id
 * @property {string} name
 * @property {string} sub
 * @property {string} time
 * @property {string} preview
 * @property {boolean} pinned
 * @property {boolean} active
 * @property {string} color
 * @property {boolean} isAll
 */

/**
 * @typedef {Object} AiUsage
 * @property {number} used
 * @property {number} limit
 */

/** @param {Partial<AiConversation>} data @returns {AiConversation} */
export function createAiConversation(data = {}) {
  return {
    id: data.id,
    name: data.name ?? '',
    sub: data.sub ?? '',
    time: data.time ?? '',
    preview: data.preview ?? '',
    pinned: data.pinned ?? false,
    active: data.active ?? false,
    color: data.color ?? 'var(--sf-primary)',
    isAll: data.isAll ?? false,
  };
}

/** Percentage of the AI token budget consumed. */
export function usagePercent({ used, limit }) {
  if (!limit) return 0;
  return Math.round((used / limit) * 1000) / 10;
}
