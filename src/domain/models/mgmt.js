/**
 * @typedef {Object} MgmtThread
 * @property {number} id
 * @property {string} name
 * @property {string} role
 * @property {string} lastMessage
 * @property {string} time
 * @property {number} unread
 * @property {boolean} online
 * @property {boolean} pinned
 * @property {boolean} channel  broadcast/announcement channel
 */

/**
 * @typedef {Object} MgmtMessage
 * @property {string} id
 * @property {'in'|'out'} dir
 * @property {string} text
 * @property {string} time
 * @property {boolean} [read]
 * @property {Object} [taskCard]  embedded assignment card
 */

/** @param {Partial<MgmtThread>} data @returns {MgmtThread} */
export function createMgmtThread(data = {}) {
  return {
    id: data.id,
    name: data.name ?? '',
    role: data.role ?? '',
    lastMessage: data.lastMessage ?? '',
    time: data.time ?? '',
    unread: data.unread ?? 0,
    online: data.online ?? false,
    pinned: data.pinned ?? false,
    channel: data.channel ?? false,
  };
}
