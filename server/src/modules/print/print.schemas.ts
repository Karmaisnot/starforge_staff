import { z } from 'zod';

/**
 * A localized leaf may arrive either fully localized (`{ uz, ru, en }`) or as a
 * plain user-typed string (the Quick-Print form sends a single string built
 * from the active locale). Both are accepted and stored verbatim in the Json
 * column, matching how the seed/mapper treat `doc`/`size` as MaybeLocalized.
 */
const localizedLeaf = z.union([
  z.string().trim().min(1).max(400),
  z.object({
    uz: z.string().max(400),
    ru: z.string().max(400),
    en: z.string().max(400),
  }),
]);

/** Body for POST /print/jobs — enqueue a print job on a printer. */
export const CreateJobSchema = z.object({
  printerId: z.string().min(1),
  doc: localizedLeaf,
  copies: z.number().int().min(1).max(999).optional(),
  size: localizedLeaf.optional(),
  libraryFileId: z.string().min(1).optional(),
});
export type CreateJobInput = z.infer<typeof CreateJobSchema>;
