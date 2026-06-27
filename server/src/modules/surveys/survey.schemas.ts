import { z } from 'zod';

/**
 * Body for POST /surveys/:id/submit. `rating` is coerced to an integer and
 * constrained to the 1..5 scale the UI presents; `comment` is optional free
 * text. Skipping carries no body.
 */
export const SubmitSurveySchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
});
export type SubmitSurveyInput = z.infer<typeof SubmitSurveySchema>;
