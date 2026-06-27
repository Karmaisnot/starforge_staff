import type { FastifyInstance } from 'fastify';
import type { AiService } from './ai.service';
import { SendMessageSchema } from './ai.schemas';

/** AI assistant routes (reads + chat writes). All require authentication. */
export function aiRoutes(service: AiService) {
  return async function register(app: FastifyInstance) {
    const auth = { preHandler: [app.authenticate] };

    app.get('/ai/conversations', auth, (req) => service.listConversations(req.auth));

    app.get('/ai/usage', auth, (req) => service.getUsage(req.auth));

    app.get('/ai/workspace', auth, (req) => service.getWorkspace(req.auth));

    app.post('/ai/conversations/:id/messages', auth, (req) => {
      const { id } = req.params as { id: string };
      const { text } = SendMessageSchema.parse(req.body);
      return service.sendMessage(req.auth, id, text);
    });

    app.delete('/ai/conversations/:id/messages', auth, (req) => {
      const { id } = req.params as { id: string };
      return service.clearMessages(req.auth, id);
    });
  };
}
