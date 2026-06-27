import type { FastifyInstance } from 'fastify';
import type { NavigationService } from './navigation.service';

/** Shell navigation badge routes. All require authentication. */
export function navigationRoutes(service: NavigationService) {
  return async function register(app: FastifyInstance) {
    const auth = { preHandler: [app.authenticate] };

    app.get('/nav/badges', auth, (req) => service.getBadges(req.auth));
  };
}
