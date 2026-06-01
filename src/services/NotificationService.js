export class NotificationService {
  /** @param {{ notificationRepo: import('@/data/repositories/interfaces.js').INotificationRepository }} deps */
  constructor({ notificationRepo }) {
    this.notificationRepo = notificationRepo;
  }
  getGroups() {
    return this.notificationRepo.listGroups();
  }
  getFilters() {
    return this.notificationRepo.listFilters();
  }
}
