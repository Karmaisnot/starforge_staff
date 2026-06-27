import type { FastifyInstance } from 'fastify';
import type { NotificationService } from './notification.service';

/** Notification read routes. All require authentication. */
export function notificationRoutes(service: NotificationService) {
  return async function register(app: FastifyInstance) {
    const auth = { preHandler: [app.authenticate] };

    app.get('/notifications/groups', auth, (req) => service.listGroups(req.auth));

    app.get('/notifications/filters', auth, (req) => service.listFilters(req.auth));

    // Mark every owned notification read FIRST: a literal path segment must be
    // registered before the ':id' param route so 'read-all' is not swallowed as
    // an id. Returns { ok, updated:n }.
    app.patch('/notifications/read-all', auth, (req) => service.markAllRead(req.auth));

    // Mark one owned notification read; 404 when not the caller's. Returns the
    // updated item in the grouped-feed item shape for cache reconciliation.
    app.patch('/notifications/:id/read', auth, (req) => {
      const { id } = req.params as { id: string };
      return service.markRead(req.auth, id);
    });
  };
}
