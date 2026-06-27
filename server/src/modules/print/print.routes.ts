import type { FastifyInstance } from 'fastify';
import type { PrintService } from './print.service';
import { CreateJobSchema } from './print.schemas';

/** Print routes (reads + queue writes). All require authentication. */
export function printRoutes(service: PrintService) {
  return async function register(app: FastifyInstance) {
    const auth = { preHandler: [app.authenticate] };

    app.get('/print/printers', auth, (req) => service.listPrinters(req.auth));

    app.get('/print/jobs', auth, (req) => service.listJobs(req.auth));

    app.get('/print/library', auth, (req) => service.getLibrary(req.auth));

    app.post('/print/jobs', auth, (req) => {
      const body = CreateJobSchema.parse(req.body);
      return service.createJob(req.auth, body);
    });

    app.delete('/print/jobs/:id', auth, (req) => {
      const { id } = req.params as { id: string };
      return service.cancelJob(req.auth, id);
    });
  };
}
