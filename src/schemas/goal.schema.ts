import { z } from 'zod'

export const goalSchema = z.object({
  id: z.string().min(1),
  matchId: z.string().min(1),
  playerId: z.string().min(1),
  minute: z.number().int().nonnegative(),
  videoUrl: z.string().url().nullable(),
})
