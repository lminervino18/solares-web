import { z } from 'zod'

export const matchResultSchema = z.enum(['victoria', 'empate', 'derrota'])

export const matchSchema = z.object({
  id: z.string().min(1),
  competitionId: z.string().min(1),
  opponent: z.string().min(1),
  date: z.string().min(1),
  isHome: z.boolean(),
  goalsFor: z.number().int().nonnegative(),
  goalsAgainst: z.number().int().nonnegative(),
  result: matchResultSchema,
})
