import { z } from 'zod';
import { LOCALES, Palette } from '../../domain/enums';

export const UpdateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    username: z
      .string()
      .trim()
      .min(2)
      .max(40)
      .regex(/^[a-zA-Z0-9._-]+$/, 'Username may contain letters, digits, dot, underscore, dash')
      .optional(),
  })
  .refine((v) => v.name !== undefined || v.username !== undefined, {
    message: 'Provide at least one field to update',
  });
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

const paletteValues = Object.values(Palette) as [string, ...string[]];

export const PatchSettingsSchema = z
  .object({
    locale: z.enum(LOCALES).optional(),
    palette: z.enum(paletteValues).optional(),
    dark: z.boolean().optional(),
    notifPush: z.boolean().optional(),
    notifCards: z.boolean().optional(),
    notifMgmt: z.boolean().optional(),
    notifSurvey: z.boolean().optional(),
    shareProfile: z.boolean().optional(),
    anonSurvey: z.boolean().optional(),
    aiData: z.boolean().optional(),
    betaCalendar: z.boolean().optional(),
    betaVoice: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Provide at least one setting to update' });
export type PatchSettingsInput = z.infer<typeof PatchSettingsSchema>;
