/**
 * @typedef {Object} Teacher
 * @property {string} name
 * @property {string} role
 * @property {string} branch
 * @property {string} username
 * @property {string[]} subjects
 * @property {{ cohorts:number, students:number, lessonsPerWeek:number }} summary
 */

/** @param {Partial<Teacher>} data @returns {Teacher} */
export function createTeacher(data = {}) {
  return {
    name: data.name ?? '',
    role: data.role ?? '',
    branch: data.branch ?? '',
    username: data.username ?? '',
    subjects: data.subjects ?? [],
    summary: data.summary ?? { cohorts: 0, students: 0, lessonsPerWeek: 0 },
  };
}
