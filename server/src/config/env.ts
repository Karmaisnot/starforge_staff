import { z } from 'zod';

/**
 * Validated, typed application configuration. The process exits early with a
 * readable error if the environment is misconfigured — fail fast, never boot
 * a half-configured server.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default('0.0.0.0'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('12h'),

  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  ANTHROPIC_API_KEY: z.string().optional().default(''),
  ANTHROPIC_MODEL: z.string().default('claude-opus-4-8'),
});

export type AppConfig = z.infer<typeof EnvSchema> & {
  isProduction: boolean;
  isTest: boolean;
  aiEnabled: boolean;
  corsOrigins: string[];
};

export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  const env = parsed.data;
  return {
    ...env,
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    aiEnabled: env.ANTHROPIC_API_KEY.trim().length > 0,
    corsOrigins: env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
  };
}
