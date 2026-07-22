import { z } from 'zod'

export const scorerSchema = z.object({
  id: z.string(),
  championshipId: z.string(),
  format: z.enum(['f8', 'f5']),
  playerName: z.string(),
  goals: z.number(),
})
