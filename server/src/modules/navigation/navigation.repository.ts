import type { Db } from '../../db/prisma';

/** The four shell badge tallies, all COMPUTED from rows. */
export interface BadgeCounts {
  tasks: number;
  surveys: number;
  mgmt: number;
  notif: number;
}

/**
 * Navigation badge data access. Every figure is a set-based `count`/`groupBy`
 * aggregate — never a per-row loop — so the shell badges stay a small, constant
 * number of queries regardless of data volume (no N+1). All queries are scoped
 * to the caller's academy (+ teacher where the badge is per-teacher).
 */
export class NavigationRepository {
  constructor(private readonly db: Db) {}

  /** Open tasks for the tenant = anything not in the terminal `done` column. */
  pendingTaskCount(academyId: string): Promise<number> {
    return this.db.task.count({
      where: { academyId, columnId: { not: 'done' } },
    });
  }

  /**
   * Surveys this teacher still owes a response to: active in the tenant and
   * lacking a *final* (submitted | skipped) response from this teacher. Computed
   * as (total surveys) − (surveys this teacher has finalised) with two counts —
   * the second filtered through the `responses` relation, so it is a single
   * grouped query, not a per-survey scan.
   */
  async openSurveyCount(academyId: string, teacherId: string): Promise<number> {
    const [total, answered] = await Promise.all([
      this.db.survey.count({ where: { academyId } }),
      this.db.survey.count({
        where: {
          academyId,
          responses: {
            some: { teacherId, status: { in: ['submitted', 'skipped'] } },
          },
        },
      }),
    ]);
    return Math.max(0, total - answered);
  }

  /**
   * Unread management threads for this teacher = threads with at least one
   * unread inbound (`dir = 'in'`, `read = false`) message. Counted by grouping
   * unread inbound messages by thread and taking the number of distinct threads,
   * so adding messages never multiplies the badge.
   */
  async unreadMgmtThreadCount(academyId: string, teacherId: string): Promise<number> {
    const rows = await this.db.mgmtMessage.groupBy({
      by: ['threadId'],
      where: {
        dir: 'in',
        read: false,
        thread: { academyId, teacherId },
      },
    });
    return rows.length;
  }

  /** Unread notifications addressed to this teacher. */
  unreadNotificationCount(academyId: string, teacherId: string): Promise<number> {
    return this.db.notification.count({
      where: { academyId, recipientId: teacherId, read: false },
    });
  }
}
