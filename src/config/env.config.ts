// src/config/env.config.ts
import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    DATABASE_URL: z
      .string()
      .refine(
        (val) =>
          val.startsWith('postgres://') || val.startsWith('postgresql://'),
        {
          message:
            'DATABASE_URL must start with "postgres://" or "postgresql://"',
        },
      ),
    PORT: z.coerce.number(),
    HOST: z.string(),
    ORIGINS: z.string(),
  })
  .required();

export const validate = (config: Record<string, unknown>) => {
  const validated = envSchema.safeParse(config);

  if (!validated.success) {
    const formatted = validated.error.flatten();
    const errorMessages = Object.entries(formatted.fieldErrors)
      .map(([key, errors]) => `  ❌ ${key}: ${errors?.join(', ')}`)
      .join('\n');

    console.error(
      '\n❌ Invalid environment variables:\n' + errorMessages + '\n',
    );
    process.exit(1);
  }
  return validated;
};
