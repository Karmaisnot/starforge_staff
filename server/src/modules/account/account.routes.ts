import type { FastifyInstance } from 'fastify';
import type { AccountService } from './account.service';
import { PatchSettingsSchema, UpdateProfileSchema } from './account.schemas';

/** Account + settings + sessions routes. All require authentication. */
export function accountRoutes(service: AccountService) {
  return async function register(app: FastifyInstance) {
    const auth = { preHandler: [app.authenticate] };

    app.get('/account/teacher', auth, (req) => service.getTeacher(req.auth));

    app.patch('/account/teacher', auth, (req) => {
      const patch = UpdateProfileSchema.parse(req.body);
      return service.updateProfile(req.auth, patch);
    });

    app.get('/account/settings', auth, (req) => service.getSettings(req.auth));

    app.patch('/account/settings', auth, (req) => {
      const patch = PatchSettingsSchema.parse(req.body);
      return service.patchSettings(req.auth, patch);
    });

    app.get('/account/sessions', auth, (req) => service.listSessions(req.auth));

    app.delete('/account/sessions/:id', auth, (req) => {
      const { id } = req.params as { id: string };
      return service.ejectSession(req.auth, id);
    });
  };
}
