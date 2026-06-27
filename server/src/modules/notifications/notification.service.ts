import type { Notification } from '@prisma/client';
import type { AuthContext } from '../../http/plugins/auth';
import type { NotificationRepository } from './notification.repository';
import {
  mapNotification,
  type NotificationFilterDto,
  type NotificationGroupDto,
  type NotificationItemDto,
} from './notification.mapper';
import { loc } from '../../shared/locale';
import { NotFoundError } from '../../shared/errors';

/** Start of the local calendar day containing `ref`. */
function startOfDay(ref: Date): Date {
  return new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
}

/**
 * Notification read use-cases. The feed is bucketed by `createdAt` into the
 * fixture's Today / Yesterday groups, and filter facet counts are COMPUTED from
 * grouped aggregates (never hardcoded, never per-row loops).
 */
export class NotificationService {
  constructor(private readonly repo: NotificationRepository) {}

  /**
   * Grouped feed. Bucketed by local-day boundaries: rows from today land in the
   * "Bugun" group (bare-clock times), rows from yesterday in "Kecha" (weekday ·
   * clock). Rows older than yesterday are dropped — the fixture only surfaces
   * these two buckets. Each item carries its real id + read flag for the UI.
   */
  async listGroups(ctx: AuthContext): Promise<NotificationGroupDto[]> {
    const rows = await this.repo.listForRecipient(ctx.academyId, ctx.teacherId);

    const todayStart = startOfDay(new Date());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    for (const n of rows) {
      if (n.createdAt >= todayStart) today.push(n);
      else if (n.createdAt >= yesterdayStart) yesterday.push(n);
    }

    const groups: NotificationGroupDto[] = [];
    if (today.length) {
      groups.push({
        label: loc('Bugun', 'Сегодня', 'Today'),
        items: today.map((n) => mapNotification(n, true)),
      });
    }
    if (yesterday.length) {
      groups.push({
        label: loc('Kecha', 'Вчера', 'Yesterday'),
        items: yesterday.map((n) => mapNotification(n, false)),
      });
    }
    return groups;
  }

  /**
   * Filter facets with COMPUTED counts. Mirrors the page's `matchesFilter`
   * predicate: `all` = every notification, `ai` = tone 'ai', `print` = icon
   * 'print', `msg` = icon 'chat'. Counts come from grouped aggregates so they
   * stay correct as the inbox changes.
   */
  async listFilters(ctx: AuthContext): Promise<NotificationFilterDto[]> {
    const { academyId, teacherId } = ctx;
    const [total, byTone, byIcon] = await Promise.all([
      this.repo.totalForRecipient(academyId, teacherId),
      this.repo.countByTone(academyId, teacherId),
      this.repo.countByIcon(academyId, teacherId),
    ]);

    return [
      { label: loc('Hammasi', 'Все', 'All'), count: total, key: 'all' },
      { label: 'AI', count: byTone.get('ai') ?? 0, key: 'ai' },
      { label: loc('Print', 'Печать', 'Print'), count: byIcon.get('print') ?? 0, key: 'print' },
      { label: loc('Xabar', 'Сообщения', 'Messages'), count: byIcon.get('chat') ?? 0, key: 'msg' },
    ];
  }

  /**
   * Mark one notification read. Scoped by tenant + recipient so a teacher may
   * only touch rows they own; a miss is a 404 (never reveal another tenant's
   * ids). Idempotent — re-reading an already-read row succeeds. Returns the
   * updated item in the SAME shape the grouped feed emits, so the frontend can
   * reconcile it into cache (time leaf chosen by the row's own day bucket).
   */
  async markRead(ctx: AuthContext, id: string): Promise<NotificationItemDto> {
    const row = await this.repo.markRead(id, ctx.academyId, ctx.teacherId);
    if (!row) throw new NotFoundError('Notification');
    return mapNotification(row, this.isToday(row));
  }

  /**
   * Mark every unread notification owned by the caller read in one set-based
   * UPDATE. Idempotent: a second call reports `updated: 0`. Returns the change
   * count so the UI can confirm without refetching the whole feed.
   */
  async markAllRead(ctx: AuthContext): Promise<{ ok: true; updated: number }> {
    const updated = await this.repo.markAllRead(ctx.academyId, ctx.teacherId);
    return { ok: true, updated };
  }

  /** Whether a row falls in the local-today bucket (drives its time leaf). */
  private isToday(n: Notification): boolean {
    return n.createdAt >= startOfDay(new Date());
  }
}
