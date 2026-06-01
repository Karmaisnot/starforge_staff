/**
 * @typedef {Object} Cohort
 * @property {string} id
 * @property {string} name
 * @property {string} level
 * @property {string} subject
 * @property {number} studentCount
 * @property {number} attendance  percentage 0-100
 * @property {number} up
 * @property {number} down
 * @property {string} next        human label, e.g. "Bugun · 09:00"
 * @property {string} color       CSS color/var
 * @property {string} room
 */

/** @param {Partial<Cohort>} data @returns {Cohort} */
export function createCohort(data = {}) {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    level: data.level ?? '',
    subject: data.subject ?? '',
    studentCount: data.studentCount ?? 0,
    attendance: data.attendance ?? 0,
    up: data.up ?? 0,
    down: data.down ?? 0,
    next: data.next ?? '',
    color: data.color ?? 'var(--sf-primary)',
    room: data.room ?? '',
  };
}

/** Domain rule: which tone an attendance value reads as. @returns {string} CSS var */
export function attendanceTone(attendance) {
  if (attendance >= 92) return 'var(--sf-success)';
  if (attendance >= 85) return 'var(--sf-warn)';
  return 'var(--sf-danger)';
}
