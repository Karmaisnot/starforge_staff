import type { FastifyInstance } from 'fastify';
import type { MaterialService } from './material.service';
import { CreateMaterialSchema } from './material.schemas';

/** Material read + write routes. All require authentication. */
export function materialRoutes(service: MaterialService) {
  return async function register(app: FastifyInstance) {
    const auth = { preHandler: [app.authenticate] };

    app.get('/materials', auth, (req) => service.list(req.auth));

    app.get('/materials/stats', auth, (req) => service.getStats(req.auth));

    app.get('/materials/storage', auth, (req) => service.getStorage(req.auth));

    app.post('/materials', auth, (req, reply) => {
      const body = CreateMaterialSchema.parse(req.body);
      reply.code(201);
      return service.create(req.auth, body);
    });

    app.delete('/materials/:id', auth, async (req, reply) => {
      const { id } = req.params as { id: string };
      await service.delete(req.auth, id);
      reply.code(204);
    });
  };
}
