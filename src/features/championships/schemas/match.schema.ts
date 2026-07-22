import { z } from 'zod'

export const matchOutcomeSchema = z.enum(['win', 'draw', 'loss', 'pending', 'cancelled'])

export const matchSchema = z.object({
  id: z.string(),
  championshipId: z.string(),
  format: z.enum(['f8', 'f5']),
  sourceOrder: z.number(),
  date: z.string().optional(),
  time: z.string().optional(),
  stage: z.string().optional(),
  venue: z.string().optional(),
  opponent: z.string(),
  goalsFor: z.number().optional(),
  goalsAgainst: z.number().optional(),
  outcome: matchOutcomeSchema,
  scoreLabel: z.string().optional(),
  scorers: z.array(z.object({ name: z.string(), goals: z.number() })).default([]),
  isFinal: z.boolean(),
  youtubeUrl: z.string().optional(),
})
