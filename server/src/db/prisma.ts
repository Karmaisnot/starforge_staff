import { PrismaClient } from '@prisma/client';

/** The concrete persistence handle injected into repositories. */
export type Db = PrismaClient;

/**
 * Build a PrismaClient. Created once in the composition root and injected
 * everywhere else — no module-level singleton import, so tests can supply
 * their own instance (or a transaction-scoped client).
 */
export function createPrisma(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}
