import type { FastifyInstance } from 'fastify';
import type { AuthService } from './auth.service';
import { LoginSchema } from './auth.schemas';

/** Auth routes plugin factory. Mounted under /api. */
export function authRoutes(service: AuthService) {
  return async function register(app: FastifyInstance) {
    app.post('/auth/login', async (req, reply) => {
      const body = LoginSchema.parse(req.body);
      const payload = await service.login(body.username, body.password, {
        userAgent: req.headers['user-agent'] ?? 'unknown',
        platform: body.platform ?? 'web',
      });
      const token = await reply.jwtSign(payload);
      return { token };
    });

    app.post('/auth/logout', { preHandler: [app.authenticate] }, async (req) => {
      await service.logout(req.auth.sessionId, req.auth.teacherId);
      return { ok: true };
    });
  };
}
