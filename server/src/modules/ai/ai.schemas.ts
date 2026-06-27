import { z } from 'zod';

/**
 * Body for POST /ai/conversations/:id/messages — the teacher's outgoing chat
 * text. Trimmed and length-bounded; a blank message is rejected (400 via
 * ZodError) so we never persist an empty turn or bill usage for nothing.
 */
export const SendMessageSchema = z.object({
  text: z.string().trim().min(1).max(4000),
});
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
