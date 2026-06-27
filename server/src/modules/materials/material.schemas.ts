import { z } from 'zod';
import { MaterialKind } from '../../domain/enums';

/** A leaf that may be a plain user-typed string or a localized {uz,ru,en} object. */
const MaybeLocalized = z.union([
  z.string().trim().min(1).max(200),
  z.object({
    uz: z.string().trim().min(1).max(200),
    ru: z.string().trim().min(1).max(200),
    en: z.string().trim().min(1).max(200),
  }),
]);

const kindValues = Object.values(MaterialKind) as [string, ...string[]];

/**
 * Create-material payload. Only metadata is accepted in this pass — no real file
 * bytes. `sizeBytes` is an optional declared size (defaults to 0); `meta` is a
 * free-form localized/plain descriptor (e.g. "2.1 MB · 8 bet").
 */
export const CreateMaterialSchema = z.object({
  title: MaybeLocalized,
  kind: z.enum(kindValues),
  sizeBytes: z.number().int().min(0).max(50 * 1024 * 1024 * 1024).optional(),
  meta: MaybeLocalized.optional(),
});
export type CreateMaterialInput = z.infer<typeof CreateMaterialSchema>;
