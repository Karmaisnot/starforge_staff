/**
 * @typedef {Object} Teacher
 * @property {string} name
 * @property {string} role
 * @property {string} roleKey
 * @property {string} accountKind
 * @property {string} branch
 * @property {string} username
 * @property {string|null} preferredLanguage
 * @property {string[]} subjects
 * @property {{ cohorts:number, students:number, lessonsPerWeek:number }} summary
 */

/** @param {Partial<Teacher>} data @returns {Teacher} */
export function createTeacher(data = {}) {
  return {
    name: data.name ?? '',
    role: data.role ?? '',
    roleKey: data.roleKey ?? 'staff',
    accountKind: data.accountKind ?? 'staff',
    branch: data.branch ?? '',
    username: data.username ?? '',
    preferredLanguage: data.preferredLanguage ?? null,
    subjects: data.subjects ?? [],
    summary: data.summary ?? { cohorts: 0, students: 0, lessonsPerWeek: 0 },
  };
}
