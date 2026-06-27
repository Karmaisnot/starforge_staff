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
  /** @param {string} id @returns {Promise<object>} */
  markRead(id) {
    return this.notificationRepo.markRead(id);
  }
  /** @returns {Promise<object>} */
  markAllRead() {
    return this.notificationRepo.markAllRead();
  }
}
