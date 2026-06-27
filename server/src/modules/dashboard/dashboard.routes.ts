import type { FastifyInstance } from 'fastify';
import type { DashboardService } from './dashboard.service';

/** Today-page aggregator route. Requires authentication. */
export function dashboardRoutes(service: DashboardService) {
  return async function register(app: FastifyInstance) {
    const auth = { preHandler: [app.authenticate] };

    app.get('/today', auth, (req) => service.getToday(req.auth));
  };
}
