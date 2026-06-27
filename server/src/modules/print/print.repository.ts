import type { Prisma } from '@prisma/client';
import type { Db } from '../../db/prisma';

/** A transaction-scoped Prisma client (the arg of `db.$transaction(async (tx) => …)`). */
export type Tx = Prisma.TransactionClient;

/**
 * Print data access: printers, the teacher's job queue, and the file library.
 *
 * Derived metrics (per-printer queue depth, library file count) are produced
 * with set-based aggregates — `groupBy` / `count` — never per-row loops, so the
 * query count stays constant regardless of how many printers/jobs exist (no N+1).
 */
export class PrintRepository {
  constructor(private readonly db: Db) {}

  /** All printers in the tenant, stable display order. */
  listPrinters(academyId: string) {
    return this.db.printer.findMany({
      where: { academyId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Waiting-queue depth per printer, as a single grouped aggregate over the
   * tenant's jobs — no per-printer query. Counts only `queued` jobs (the job
   * currently `now` printing occupies the head, not the queue), matching the
   * fixture where a `free` printer with a job in progress still shows queue 0.
   */
  async queuedJobCountByPrinter(academyId: string): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    const rows = await this.db.printJob.groupBy({
      by: ['printerId'],
      where: { academyId, state: 'queued' },
      _count: { _all: true },
    });
    for (const r of rows) out.set(r.printerId, r._count._all);
    return out;
  }

  /**
   * The teacher's active jobs (now first, then queued), each joined to its
   * printer so the DTO can show the printer name without a follow-up lookup.
   */
  listActiveJobs(academyId: string, teacherId: string) {
    return this.db.printJob.findMany({
      where: { academyId, teacherId, state: { in: ['now', 'queued'] } },
      include: { printer: true },
      // `now` (state) sorts before `queued` alphabetically; newest first within a state.
      orderBy: [{ state: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /** Total files in the teacher's library — a single COUNT, never a row load. */
  countLibraryFiles(academyId: string, teacherId: string): Promise<number> {
    return this.db.libraryFile.count({ where: { academyId, teacherId } });
  }

  // -------------------------------------------------------------------------
  // Writes (transactional). Each helper takes the tx client so the service can
  // compose them inside a single `$transaction`, keeping the "at most one `now`
  // per printer" invariant atomic against concurrent enqueues/cancels.
  // -------------------------------------------------------------------------

  /** Run `fn` inside a serializable-by-default Prisma interactive transaction. */
  transaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
    return this.db.$transaction(fn);
  }

  /** Load a printer scoped to the tenant (null if it belongs to no/other academy). */
  findPrinter(tx: Tx, printerId: string, academyId: string) {
    return tx.printer.findFirst({ where: { id: printerId, academyId } });
  }

  /**
   * True if the printer already has a job occupying the head slot (`state=now`).
   * Re-checked inside the transaction right before insert so two concurrent
   * enqueues can never both claim `now` for the same printer.
   */
  async hasActiveNow(tx: Tx, printerId: string): Promise<boolean> {
    const head = await tx.printJob.count({ where: { printerId, state: 'now' } });
    return head > 0;
  }

  /** Verify a library file belongs to the teacher's tenant (used to scope an attachment). */
  findLibraryFile(tx: Tx, libraryFileId: string, academyId: string, teacherId: string) {
    return tx.libraryFile.findFirst({ where: { id: libraryFileId, academyId, teacherId } });
  }

  /** Insert a job and return it joined to its printer (for the DTO mapper). */
  createJob(
    tx: Tx,
    data: {
      academyId: string;
      teacherId: string;
      printerId: string;
      doc: Prisma.InputJsonValue;
      size?: Prisma.InputJsonValue;
      copies: number;
      state: 'now' | 'queued';
      libraryFileId?: string;
    },
  ) {
    return tx.printJob.create({
      data: {
        academyId: data.academyId,
        teacherId: data.teacherId,
        printerId: data.printerId,
        doc: data.doc,
        size: data.size,
        copies: data.copies,
        state: data.state,
        progress: 0,
        libraryFileId: data.libraryFileId,
      },
      include: { printer: true },
    });
  }

  /** Load a job scoped to the tenant + teacher (null if missing/other-owned). */
  findOwnedJob(tx: Tx, jobId: string, academyId: string, teacherId: string) {
    return tx.printJob.findFirst({ where: { id: jobId, academyId, teacherId } });
  }

  /** Hard-delete a job (cancel). Scoped defensively to the same tenant + teacher. */
  deleteJob(tx: Tx, jobId: string, academyId: string, teacherId: string) {
    return tx.printJob.deleteMany({ where: { id: jobId, academyId, teacherId } });
  }

  /** Oldest queued job on a printer — the promotion candidate when `now` frees up. */
  oldestQueued(tx: Tx, printerId: string) {
    return tx.printJob.findFirst({
      where: { printerId, state: 'queued' },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Promote a specific job to the head slot (`now`). */
  promoteToNow(tx: Tx, jobId: string) {
    return tx.printJob.update({ where: { id: jobId }, data: { state: 'now' } });
  }
}
