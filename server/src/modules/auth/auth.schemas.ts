import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  platform: z.string().optional(),
});
export type LoginInput = z.infer<typeof LoginSchema>;
