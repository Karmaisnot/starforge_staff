import { CardKind } from '../enums.js';

/**
 * @typedef {Object} Card
 * @property {string} id
 * @property {'up'|'down'} kind
 * @property {string} typeName
 * @property {string} recipient
 * @property {string} cohort
 * @property {string} reason
 * @property {string} issuer
 * @property {string} when
 */

/**
 * @typedef {Object} CardType  Center-configured card definition.
 * @property {string} name
 * @property {'up'|'down'} kind
 * @property {string} subtitle
 * @property {number} count    issued this period
 */

/** @param {Partial<Card>} data @returns {Card} */
export function createCard(data = {}) {
  return {
    id: data.id ?? '',
    kind: data.kind ?? CardKind.UP,
    typeName: data.typeName ?? '',
    recipient: data.recipient ?? '',
    cohort: data.cohort ?? '',
    reason: data.reason ?? '',
    issuer: data.issuer ?? '',
    when: data.when ?? '',
  };
}

/** Gradient + ink palette for a card kind (used by mini-card chrome). */
export function cardKindPalette(kind) {
  return kind === CardKind.UP
    ? { bg: 'linear-gradient(135deg, #f6e0ac, #e9c272)', border: '#c49a3a', star: '#7a4f0e' }
    : { bg: 'linear-gradient(135deg, #f0c9be, #d88a75)', border: '#a14026', star: '#5c1a0c' };
}
