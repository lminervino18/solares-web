import { z } from 'zod'

/**
 * Runtime validation for the generated goals manifest.
 *
 * Entries are validated one by one so a single malformed goal is dropped
 * instead of breaking the whole gallery. Only public delivery fields are
 * accepted; anything else in the file is ignored.
 */

const httpsUrl = z.string().url().startsWith('https://')

export const goalVideoSchema = z.object({
  id: z.string().min(1),
  format: z.enum(['f8', 'f5']),
  scorer: z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
  }),
  competition: z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    format: z.enum(['f8', 'f5']),
    type: z.enum(['official', 'friendly', 'preseason', 'other']),
    championshipId: z.string().min(1).optional(),
  }),
  cloudinary: z.object({
    publicId: z.string().min(1),
    version: z.number().int().positive().optional(),
    format: z.string().min(1),
    resourceType: z.literal('video'),
    secureUrl: httpsUrl,
    playbackUrl: httpsUrl,
    posterUrl: httpsUrl,
    downloadUrl: httpsUrl,
  }),
  media: z.object({
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    duration: z.number().positive().optional(),
    bytes: z.number().nonnegative(),
    aspectRatio: z.number().positive().optional(),
  }),
  source: z.object({
    fileName: z.string().min(1),
    createdAt: z.string().min(1),
    hash: z.string().min(1),
  }),
})

export const goalsManifestSchema = z.object({
  generatedAt: z.string().min(1),
  goals: z.array(z.unknown()),
})

export type ValidatedGoalVideo = z.infer<typeof goalVideoSchema>
