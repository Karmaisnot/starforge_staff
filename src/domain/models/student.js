/**
 * @typedef {Object} Student
 * @property {string} id
 * @property {string} name
 * @property {string} studentId   external roster id, e.g. "DEMO-2026-00042"
 * @property {number} up
 * @property {number} down
 * @property {number} attendance
 * @property {'top'|'warn'|null} flag
 */

/** @param {Partial<Student>} data @returns {Student} */
export function createStudent(data = {}) {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    studentId: data.studentId ?? '',
    up: data.up ?? 0,
    down: data.down ?? 0,
    attendance: data.attendance ?? 0,
    flag: data.flag ?? null,
  };
}
