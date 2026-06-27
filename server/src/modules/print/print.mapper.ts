import type { Printer, PrintJob } from '@prisma/client';
import { loc, type Localized } from '../../shared/locale';

/** A job row with its printer eagerly loaded (see PrintRepository.listActiveJobs). */
export type PrintJobWithPrinter = PrintJob & { printer: Printer };

/**
 * Capability tags stored on `Printer.capabilities` (a JSON string[]). They are
 * the single source of truth for the derived display fields the fixture shows
 * (`color`, `sizes`, `accent`, busy `eta` time), so none are stale literals.
 */
const CAP_COLOR = 'color';
const CAP_A3 = 'A3';
const CAP_ETA = 'eta:'; // busy printers carry `eta:HH:MM` (free-at time)

/** Status -> accent CSS var (matches printersFixture). */
const STATUS_ACCENT: Record<string, string> = {
  free: 'var(--sf-success)',
  busy: 'var(--sf-warn)',
  locked: 'var(--sf-muted)',
};

function capsOf(printer: Printer): string[] {
  const raw = printer.capabilities;
  return Array.isArray(raw) ? (raw as string[]) : [];
}

/** Human "sizes" summary, e.g. "A4", "A4 · A3 · color" — derived from capabilities. */
function sizesLabel(caps: string[]): string {
  const parts = ['A4'];
  if (caps.includes(CAP_A3)) parts.push('A3');
  if (caps.includes(CAP_COLOR)) parts.push('color');
  return parts.join(' · ');
}

/** Time embedded in a capability tag, e.g. `eta:11:34` -> `11:34`. */
function tagTime(caps: string[]): string {
  const tag = caps.find((c) => c.startsWith(CAP_ETA));
  return tag ? tag.slice(CAP_ETA.length) : '';
}

/**
 * Localized availability line. `free`/`locked` are fixed phrases; `busy` carries
 * its free-at time (pinned by the seed in `capabilities` as `eta:HH:MM`), giving
 * display parity with the fixture's "11:34 da bo'shaydi".
 */
function printerEta(printer: Printer, caps: string[]): Localized {
  if (printer.status === 'free') return loc('Hozir tayyor', 'Готов сейчас', 'Ready now');
  if (printer.status === 'locked') return loc('Faqat ma‘muriyat', 'Только администрация', 'Admin only');
  const time = tagTime(caps);
  return loc(`${time} da bo‘shaydi`, `Освободится в ${time}`, `Free at ${time}`);
}

/** Printer DTO — matches printersFixture (localized leaves passed through). */
export function mapPrinter(printer: Printer, queue: number) {
  const caps = capsOf(printer);
  return {
    id: printer.id,
    name: printer.name, // mixed (plain string in seed)
    location: printer.location, // localized
    status: printer.status, // 'free' | 'busy' | 'locked'
    eta: printerEta(printer, caps), // localized
    queue, // COMPUTED: active jobs on this printer
    color: caps.includes(CAP_COLOR),
    sizes: sizesLabel(caps),
    accent: STATUS_ACCENT[printer.status] ?? 'var(--sf-muted)',
  };
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

/** Minutes of print time a job needs, from copies (≈8 pages/copy, ~50 ppm). */
function jobDurationMs(job: PrintJob): number {
  const pages = job.copies * 8;
  return Math.max(1, Math.ceil(pages / 50)) * 60_000;
}

/** Wall-clock "HH:MM" when a job finishes (now) or starts (queued). */
function jobClock(job: PrintJob): string {
  const base = job.createdAt.getTime();
  // `now` is mid-print: project to completion. `queued` shows its start time.
  const at = job.state === 'now' ? base + jobDurationMs(job) : base;
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Localized job status line: finish time for `now`, start time for `queued`. */
function jobEta(job: PrintJob): Localized {
  const time = jobClock(job);
  return job.state === 'now'
    ? loc(`Tugaydi · ${time}`, `Закончит · ${time}`, `Done · ${time}`)
    : loc(`Boshlanadi · ${time}`, `Начнёт · ${time}`, `Starts · ${time}`);
}

/** Fixture icon: brand mark for star-card prints, generic doc otherwise. */
function jobIcon(job: PrintJob): string {
  const doc = job.doc;
  const en =
    typeof doc === 'object' && doc !== null
      ? String((doc as Record<string, unknown>).en ?? '')
      : String(doc);
  return /star card|yulduz|звёзд/i.test(en) ? 'brand' : 'doc';
}

/** Printer name without the " · model" suffix (fixture shows "HP LaserJet"). */
function printerShortName(printer: Printer): string {
  const name = printer.name;
  const full =
    typeof name === 'object' && name !== null
      ? String((name as Record<string, unknown>).en ?? Object.values(name as Record<string, unknown>)[0] ?? '')
      : String(name);
  return full.split(' · ')[0] ?? full;
}

/** Print-job DTO — matches printJobsFixture (localized leaves passed through). */
export function mapJob(job: PrintJobWithPrinter) {
  return {
    id: job.id,
    doc: job.doc, // mixed (localized in seed)
    icon: jobIcon(job),
    copies: job.copies,
    size: job.size, // mixed (localized in seed)
    printer: printerShortName(job.printer),
    progress: job.progress,
    eta: jobEta(job), // localized
    state: job.state, // 'now' | 'queued'
  };
}

/** Library DTO — matches printLibraryFixture. */
export function mapLibrary(fileCount: number) {
  return { fileCount };
}
