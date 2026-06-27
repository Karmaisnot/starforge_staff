import type { Prisma } from '@prisma/client';
import type { Db } from '../../db/prisma';

/** Aggregated storage figures for the active teacher's materials. */
export interface StorageAggregate {
  usedBytes: number;
  fileCount: number;
}

/**
 * Material data access. All reads are scoped to the owning teacher within the
 * tenant. Per-kind counts and storage totals are produced with set-based
 * groupBy/aggregate queries — never per-row loops — so a library of any size
 * stays a constant number of queries (no N+1).
 */
export class MaterialRepository {
  constructor(private readonly db: Db) {}

  /** Recent materials for the teacher (newest first), capped to `take`. */
  listRecent(academyId: string, ownerId: string, take: number) {
    return this.db.material.findMany({
      where: { academyId, ownerId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  /** Count of materials per kind for the teacher. */
  async countByKind(academyId: string, ownerId: string): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    const rows = await this.db.material.groupBy({
      by: ['kind'],
      where: { academyId, ownerId },
      _count: { _all: true },
    });
    for (const r of rows) out.set(r.kind, r._count._all);
    return out;
  }

  /** SUM(sizeBytes) + COUNT for the teacher's materials, in one aggregate query. */
  async storage(academyId: string, ownerId: string): Promise<StorageAggregate> {
    const agg = await this.db.material.aggregate({
      where: { academyId, ownerId },
      _sum: { sizeBytes: true },
      _count: { _all: true },
    });
    return { usedBytes: agg._sum.sizeBytes ?? 0, fileCount: agg._count._all };
  }

  /** Insert a new material; tenancy/ownership are supplied by the service, never the client. */
  create(data: Prisma.MaterialUncheckedCreateInput) {
    return this.db.material.create({ data });
  }

  /** Look up a single material scoped to its owning teacher within the tenant. */
  findOwned(id: string, academyId: string, ownerId: string) {
    return this.db.material.findFirst({ where: { id, academyId, ownerId } });
  }

  /**
   * Delete a material that belongs to this teacher. Scoped by id + tenancy +
   * owner so a foreign id can never match; returns the affected row count
   * (0 = not found / not theirs) for an idempotent caller decision.
   */
  async deleteOwned(id: string, academyId: string, ownerId: string): Promise<number> {
    const { count } = await this.db.material.deleteMany({ where: { id, academyId, ownerId } });
    return count;
  }
}
