import type { Prisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/errors';
import type { AuthContext } from '../../http/plugins/auth';
import type { PrintRepository } from './print.repository';
import type { CreateJobInput } from './print.schemas';
import { mapJob, mapLibrary, mapPrinter } from './print.mapper';

/** Print read use-cases: printer fleet, the teacher's queue, and library size. */
export class PrintService {
  constructor(private readonly repo: PrintRepository) {}

  /** Printers in the tenant; `queue` = computed active-job depth per printer. */
  async listPrinters(ctx: AuthContext) {
    const [printers, queueByPrinter] = await Promise.all([
      this.repo.listPrinters(ctx.academyId),
      this.repo.queuedJobCountByPrinter(ctx.academyId),
    ]);
    return printers.map((p) => mapPrinter(p, queueByPrinter.get(p.id) ?? 0));
  }

  /** The teacher's active jobs (now + queued). */
  async listJobs(ctx: AuthContext) {
    const jobs = await this.repo.listActiveJobs(ctx.academyId, ctx.teacherId);
    return jobs.map(mapJob);
  }

  /** Library summary; `fileCount` = computed COUNT of the teacher's files. */
  async getLibrary(ctx: AuthContext) {
    const fileCount = await this.repo.countLibraryFiles(ctx.academyId, ctx.teacherId);
    return mapLibrary(fileCount);
  }

  /**
   * Enqueue a print job. CONCURRENCY-CRITICAL: the printer load, the
   * locked-check, the `now`-occupancy re-check, and the insert all run inside a
   * single interactive transaction so two simultaneous requests can never both
   * win the single `now` slot — the loser is created as `queued` instead.
   * Queue depth stays compute-on-read (COUNT in the mapper layer), never stored.
   */
  async createJob(ctx: AuthContext, input: CreateJobInput) {
    const job = await this.repo.transaction(async (tx) => {
      const printer = await this.repo.findPrinter(tx, input.printerId, ctx.academyId);
      if (!printer) throw new NotFoundError('Printer');
      if (printer.status === 'locked') {
        throw new ConflictError('This printer is locked and not accepting jobs');
      }

      // Scope the optional library-file attachment to the same tenant + teacher.
      if (input.libraryFileId) {
        const file = await this.repo.findLibraryFile(
          tx,
          input.libraryFileId,
          ctx.academyId,
          ctx.teacherId,
        );
        if (!file) throw new NotFoundError('Library file');
      }

      // At most ONE `now` per printer: if the head slot is taken, queue behind it.
      const headTaken = await this.repo.hasActiveNow(tx, printer.id);
      const state: 'now' | 'queued' = headTaken ? 'queued' : 'now';

      return this.repo.createJob(tx, {
        academyId: ctx.academyId,
        teacherId: ctx.teacherId,
        printerId: printer.id,
        doc: input.doc as Prisma.InputJsonValue,
        size: input.size as Prisma.InputJsonValue | undefined,
        copies: input.copies ?? 1,
        state,
        libraryFileId: input.libraryFileId,
      });
    });
    return mapJob(job);
  }

  /**
   * Cancel a job. If the cancelled job held the head slot (`state=now`), the
   * oldest remaining `queued` job on the same printer is promoted to `now` in
   * the same transaction, preserving the single-active-head invariant.
   */
  async cancelJob(ctx: AuthContext, jobId: string) {
    await this.repo.transaction(async (tx) => {
      const job = await this.repo.findOwnedJob(tx, jobId, ctx.academyId, ctx.teacherId);
      if (!job) throw new NotFoundError('Print job');

      await this.repo.deleteJob(tx, jobId, ctx.academyId, ctx.teacherId);

      if (job.state === 'now') {
        const next = await this.repo.oldestQueued(tx, job.printerId);
        if (next) await this.repo.promoteToNow(tx, next.id);
      }
    });
    return { ok: true };
  }
}
