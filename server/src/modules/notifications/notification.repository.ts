import type { Db } from '../../db/prisma';

/** Tone counts keyed by the `tone` column value. */
export type ToneCounts = Map<string, number>;

/** Icon counts keyed by the `icon` column value. */
export type IconCounts = Map<string, number>;

/**
 * Notification data access for one teacher. Filter facet counts are produced
 * with set-based groupBy aggregates (one query per facet axis) — never per-row
 * loops — so the inbox stays a constant number of queries regardless of volume.
 */
export class NotificationRepository {
  constructor(private readonly db: Db) {}

  /** All of a teacher's notifications, newest first (drives the grouped feed). */
  listForRecipient(academyId: string, recipientId: string) {
    return this.db.notification.findMany({
      where: { academyId, recipientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Total count for the recipient (the "all" facet). */
  totalForRecipient(academyId: string, recipientId: string): Promise<number> {
    return this.db.notification.count({ where: { academyId, recipientId } });
  }

  /** Count by tone (drives the "ai" facet) — one grouped query, no N+1. */
  async countByTone(academyId: string, recipientId: string): Promise<ToneCounts> {
    const out: ToneCounts = new Map();
    const rows = await this.db.notification.groupBy({
      by: ['tone'],
      where: { academyId, recipientId },
      _count: { _all: true },
    });
    for (const r of rows) out.set(r.tone, r._count._all);
    return out;
  }

  /** Count by icon (drives the "print" / "msg" facets) — one grouped query. */
  async countByIcon(academyId: string, recipientId: string): Promise<IconCounts> {
    const out: IconCounts = new Map();
    const rows = await this.db.notification.groupBy({
      by: ['icon'],
      where: { academyId, recipientId },
      _count: { _all: true },
    });
    for (const r of rows) if (r.icon) out.set(r.icon, r._count._all);
    return out;
  }

  /** One notification, scoped to the owning recipient within the tenant. */
  findOwned(id: string, academyId: string, recipientId: string) {
    return this.db.notification.findFirst({ where: { id, academyId, recipientId } });
  }

  /**
   * Mark a single owned notification read. Scoped by tenant + recipient in the
   * WHERE so a teacher can never flip another's row; returns the updated row, or
   * null when no row matched (not theirs / wrong tenant). Idempotent — flipping
   * an already-read row is a no-op that still returns the current row.
   */
  async markRead(id: string, academyId: string, recipientId: string) {
    const res = await this.db.notification.updateMany({
      where: { id, academyId, recipientId },
      data: { read: true },
    });
    if (res.count === 0) return null;
    return this.db.notification.findFirst({ where: { id, academyId, recipientId } });
  }

  /**
   * Mark every still-unread notification owned by the recipient read in one
   * set-based UPDATE (no per-row loop, no N+1). Returns how many rows changed;
   * already-read rows are excluded so the count reflects real transitions and
   * the call is naturally idempotent (second call updates 0).
   */
  async markAllRead(academyId: string, recipientId: string): Promise<number> {
    const res = await this.db.notification.updateMany({
      where: { academyId, recipientId, read: false },
      data: { read: true },
    });
    return res.count;
  }
}
