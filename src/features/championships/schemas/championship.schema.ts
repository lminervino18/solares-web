import { z } from 'zod'

import { matchSchema } from './match.schema'
import { scorerSchema } from './scorer.schema'

export const championshipStatsSchema = z.object({
  played: z.number(),
  won: z.number(),
  drawn: z.number(),
  lost: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalDifference: z.number(),
})

export const youTubeVideoSchema = z.object({
  videoId: z.string(),
  url: z.string(),
  embedUrl: z.string(),
})

export const championshipHonorTypeSchema = z.enum([
  'gold-champion',
  'silver-champion',
  'gold-runner-up',
  'silver-runner-up',
  'semifinalist',
  'quarterfinalist',
  'group-stage',
  'other',
  'unknown',
])

export const championshipSchema = z.object({
  id: z.string(),
  slug: z.string(),
  format: z.enum(['f8', 'f5']),
  name: z.string(),
  published: z.boolean().default(true),
  shortName: z.string().optional(),
  year: z.number().optional(),
  season: z.string().optional(),
  league: z.string().optional(),
  status: z.enum(['scheduled', 'in-progress', 'completed', 'unknown']),
  resultLabel: z.string().optional(),
  honorType: championshipHonorTypeSchema,
  trophyTier: z.enum(['gold', 'silver', 'none']),
  sourceOrder: z.number(),
  matches: z.array(matchSchema),
  scorers: z.array(scorerSchema),
  stats: championshipStatsSchema,
  assets: z.object({}).loose(),
  finalVideo: youTubeVideoSchema.optional(),
})

export const championshipsSnapshotSchema = z.object({
  syncedAt: z.string(),
  championships: z.array(championshipSchema),
})

export type ChampionshipsSnapshotInput = z.infer<typeof championshipsSnapshotSchema>
