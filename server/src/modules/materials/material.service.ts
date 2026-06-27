import type { AuthContext } from '../../http/plugins/auth';
import { NotFoundError } from '../../shared/errors';
import type { MaterialRepository } from './material.repository';
import { mapMaterial, mapStats, mapStorage } from './material.mapper';
import type { CreateMaterialInput } from './material.schemas';

/** How many recent materials the list endpoint returns (the "Recent" card subset). */
const RECENT_LIMIT = 12;

/**
 * Material read use-cases. Every query is scoped to the authenticated teacher
 * within the tenant; per-kind counts and storage totals are computed from rows.
 */
export class MaterialService {
  constructor(private readonly repo: MaterialRepository) {}

  async list(ctx: AuthContext) {
    const materials = await this.repo.listRecent(ctx.academyId, ctx.teacherId, RECENT_LIMIT);
    return materials.map(mapMaterial);
  }

  async getStats(ctx: AuthContext) {
    const counts = await this.repo.countByKind(ctx.academyId, ctx.teacherId);
    return mapStats(counts);
  }

  async getStorage(ctx: AuthContext) {
    const { usedBytes, fileCount } = await this.repo.storage(ctx.academyId, ctx.teacherId);
    return mapStorage(usedBytes, fileCount);
  }

  /**
   * Create a metadata-only material owned by the active teacher. No real file
   * bytes are stored in this pass; `sizeBytes` is the declared size (default 0)
   * that feeds the compute-on-read storage total. Returns the same DTO shape as
   * the list endpoint so the frontend can splice it straight into its cache.
   */
  async create(ctx: AuthContext, input: CreateMaterialInput) {
    const material = await this.repo.create({
      academyId: ctx.academyId,
      ownerId: ctx.teacherId,
      kind: input.kind,
      title: input.title,
      meta: input.meta,
      sizeBytes: input.sizeBytes ?? 0,
    });
    return mapMaterial(material);
  }

  /**
   * Delete a material owned by this teacher. 404 (NotFoundError) if no material
   * with that id belongs to the active teacher in the tenant — a foreign id is
   * indistinguishable from a missing one, so cross-tenant probing reveals
   * nothing. Storage/fileCount stay compute-on-read (no counter to decrement).
   */
  async delete(ctx: AuthContext, id: string): Promise<void> {
    const removed = await this.repo.deleteOwned(id, ctx.academyId, ctx.teacherId);
    if (removed === 0) throw new NotFoundError('Material');
  }
}
