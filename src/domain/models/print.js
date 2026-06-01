import { PrinterStatus, PrintJobState } from '../enums.js';

/**
 * @typedef {Object} Printer
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {'free'|'busy'|'locked'} status
 * @property {string} eta
 * @property {number} queue
 * @property {boolean} color
 * @property {string} sizes
 * @property {string} accent  CSS var
 */

/**
 * @typedef {Object} PrintJob
 * @property {string} id
 * @property {string} doc
 * @property {number} copies
 * @property {string} size
 * @property {string} printer
 * @property {number} progress  0-100
 * @property {string} eta
 * @property {'now'|'queued'} state
 */

/** @param {Partial<Printer>} data @returns {Printer} */
export function createPrinter(data = {}) {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    location: data.location ?? '',
    status: data.status ?? PrinterStatus.FREE,
    eta: data.eta ?? '',
    queue: data.queue ?? 0,
    color: data.color ?? false,
    sizes: data.sizes ?? 'A4',
    accent: data.accent ?? 'var(--sf-success)',
  };
}

/** @param {Partial<PrintJob>} data @returns {PrintJob} */
export function createPrintJob(data = {}) {
  return {
    id: data.id ?? '',
    doc: data.doc ?? '',
    copies: data.copies ?? 1,
    size: data.size ?? '',
    printer: data.printer ?? '',
    progress: data.progress ?? 0,
    eta: data.eta ?? '',
    state: data.state ?? PrintJobState.QUEUED,
  };
}

/** Chip tone for a printer status. */
export function printerStatusTone(status) {
  if (status === PrinterStatus.FREE) return 'success';
  if (status === PrinterStatus.BUSY) return 'accent';
  return 'neutral';
}
