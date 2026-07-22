import { z } from 'zod'

import { teamCategorySchema } from './team.schema'

export const competitionStatusSchema = z.enum(['proximo', 'en-curso', 'finalizado'])

export const competitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  season: z.string().min(1),
  category: teamCategorySchema,
  status: competitionStatusSchema,
})
