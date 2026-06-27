import type { AuthContext } from '../../http/plugins/auth';
import type { BadgeCounts, NavigationRepository } from './navigation.repository';

/**
 * Shell badge use-cases. Mirrors the frontend `NavigationService.getBadges()`
 * contract ({ tasks, surveys, mgmt, notif }) but every number is COMPUTED from
 * the tenant's rows instead of the stale fixture literals.
 */
export class NavigationService {
  constructor(private readonly repo: NavigationRepository) {}

  /** GET /nav/badges — the four shell counts, scoped to the caller. */
  async getBadges(ctx: AuthContext): Promise<BadgeCounts> {
    const { academyId, teacherId } = ctx;
    const [tasks, surveys, mgmt, notif] = await Promise.all([
      this.repo.pendingTaskCount(academyId),
      this.repo.openSurveyCount(academyId, teacherId),
      this.repo.unreadMgmtThreadCount(academyId, teacherId),
      this.repo.unreadNotificationCount(academyId, teacherId),
    ]);
    return { tasks, surveys, mgmt, notif };
  }
}
