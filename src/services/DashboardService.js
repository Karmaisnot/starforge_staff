export class DashboardService {
  /** @param {{ dashboardRepo: import('@/data/repositories/interfaces.js').IDashboardRepository }} deps */
  constructor({ dashboardRepo }) {
    this.dashboardRepo = dashboardRepo;
  }
  getToday() {
    return this.dashboardRepo.getToday();
  }
}
