import { loadConfig } from './config/env';
import { createPrisma } from './db/prisma';
import { createContainer } from './container';
import { buildApp } from './http/app';

/** Process entrypoint: load config, wire the container, start listening. */
async function main(): Promise<void> {
  const config = loadConfig();
  const db = createPrisma();
  const container = createContainer(config, db);
  const app = await buildApp({ config, container });

  const close = async (signal: string) => {
    app.log.info({ signal }, 'Shutting down');
    await app.close();
    await db.$disconnect();
    process.exit(0);
  };
  process.on('SIGINT', () => void close('SIGINT'));
  process.on('SIGTERM', () => void close('SIGTERM'));

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
  } catch (err) {
    app.log.error(err);
    await db.$disconnect();
    process.exit(1);
  }
}

void main();
