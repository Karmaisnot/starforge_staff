import { ScheduleState } from '../enums.js';

/**
 * @typedef {Object} ScheduleSlot
 * @property {string} time
 * @property {string} label
 * @property {string} room
 * @property {'now'|'next'|'gap'|''} state
 * @property {string} [mins]   countdown label when state==='now'
 */

/** @param {Partial<ScheduleSlot>} data @returns {ScheduleSlot} */
export function createScheduleSlot(data = {}) {
  return {
    time: data.time ?? '',
    label: data.label ?? '',
    room: data.room ?? '',
    state: data.state ?? ScheduleState.NONE,
    mins: data.mins ?? '',
  };
}

/** Rail color for a schedule slot. */
export function slotRailColor(state) {
  if (state === ScheduleState.NOW) return 'var(--sf-primary)';
  if (state === ScheduleState.GAP) return 'var(--sf-border-strong)';
  return 'var(--sf-accent)';
}
