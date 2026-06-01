/**
 * @typedef {Object} Material
 * @property {string} id
 * @property {string} title
 * @property {string} meta       e.g. "2.1 MB · 8 bet"
 * @property {'pdf'|'video'|'doc'} kind
 * @property {string} color      CSS var
 * @property {number} views
 * @property {string} date
 * @property {boolean} aiSummary
 */

/** @param {Partial<Material>} data @returns {Material} */
export function createMaterial(data = {}) {
  return {
    id: data.id ?? '',
    title: data.title ?? '',
    meta: data.meta ?? '',
    kind: data.kind ?? 'doc',
    color: data.color ?? 'var(--sf-accent)',
    views: data.views ?? 0,
    date: data.date ?? '',
    aiSummary: data.aiSummary ?? false,
  };
}
