import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import type { AppConfig } from '../config/env';
import type { Container } from '../container';
import { registerErrorHandler } from './errorHandler';
import { authPlugin } from './plugins/auth';
import { registerRoutes } from './routes';

export interface AppDeps {
  config: AppConfig;
  container: Container;
}

/**
 * Builds the Fastify instance from injected dependencies. No `new` calls here —
 * the composition root assembles the container; this just plugs it into HTTP.
 */
export async function buildApp(deps: AppDeps): Promise<FastifyInstance> {
  const { config, container } = deps;

  const app = Fastify({
    trustProxy: true,
    logger: config.isProduction
      ? { level: 'info' }
      : config.isTest
        ? false
        : {
            level: 'debug',
            transport: {
              target: 'pino-pretty',
              options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
            },
          },
  });

  // Tolerate empty bodies on JSON requests (a bare PATCH/DELETE with an
  // application/json content-type but no body parses to undefined, not a 400).
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
    if (body === '' || body == null) return done(null, undefined);
    try {
      done(null, JSON.parse(body as string));
    } catch (err) {
      (err as { statusCode?: number }).statusCode = 400;
      done(err as Error, undefined);
    }
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, { origin: config.corsOrigins, credentials: true });
  await app.register(authPlugin, { config });

  registerErrorHandler(app);

  app.get('/health', async () => ({
    status: 'ok',
    env: config.NODE_ENV,
    aiEnabled: config.aiEnabled,
    uptime: Math.round(process.uptime()),
  }));

  await registerRoutes(app, container);

  return app;
}
