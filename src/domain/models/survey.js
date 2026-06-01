/**
 * @typedef {Object} Survey
 * @property {string} id
 * @property {string} title
 * @property {string} issuer
 * @property {string} deadline
 * @property {string} remaining
 * @property {number} questions
 * @property {string} estimate
 * @property {number} progress    0-100
 * @property {boolean} urgent
 */

/**
 * @typedef {Object} SurveyHistoryItem
 * @property {string} title
 * @property {string} issuer
 * @property {string} status
 * @property {boolean} skipped
 * @property {string} date
 */

/** @param {Partial<Survey>} data @returns {Survey} */
export function createSurvey(data = {}) {
  return {
    id: data.id ?? '',
    title: data.title ?? '',
    issuer: data.issuer ?? '',
    deadline: data.deadline ?? '',
    remaining: data.remaining ?? '',
    questions: data.questions ?? 0,
    estimate: data.estimate ?? '',
    progress: data.progress ?? 0,
    urgent: data.urgent ?? false,
  };
}
