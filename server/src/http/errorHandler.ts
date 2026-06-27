import type { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError, isAppError } from '../shared/errors';

/** Uniform JSON error envelope: { error: { code, message, details? } }. */
function send(reply: FastifyReply, status: number, code: string, message: string, details?: unknown) {
  return reply.status(status).send({ error: { code, message, ...(details ? { details } : {}) } });
}

/**
 * Centralised error translation. Domain errors map to their declared status;
 * Zod validation errors map to 400; everything unexpected becomes a 500 with
 * the internals logged but never returned to the client.
 */
export function registerErrorHandler(app: FastifyInstance): void {
  app.setNotFoundHandler((req: FastifyRequest, reply: FastifyReply) =>
    send(reply, 404, 'NOT_FOUND', `Route ${req.method} ${req.url} not found`),
  );

  app.setErrorHandler((err: FastifyError | AppError | ZodError, req: FastifyRequest, reply: FastifyReply) => {
    if (isAppError(err)) {
      if (err.status >= 500) req.log.error({ err }, err.message);
      else req.log.info({ code: err.code }, err.message);
      return send(reply, err.status, err.code, err.message, err.details);
    }

    if (err instanceof ZodError) {
      return send(reply, 400, 'VALIDATION_ERROR', 'Request validation failed', err.flatten());
    }

    // Fastify's own validation / known errors carry a statusCode.
    const status = (err as FastifyError).statusCode ?? 500;
    if (status < 500) {
      return send(reply, status, (err as FastifyError).code ?? 'BAD_REQUEST', err.message);
    }

    req.log.error({ err }, 'Unhandled error');
    return send(reply, 500, 'INTERNAL_ERROR', 'An unexpected error occurred');
  });
}
