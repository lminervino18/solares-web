import { z } from 'zod'

import { teamCategorySchema } from './team.schema'

export const playerPositionSchema = z.enum(['arquero', 'defensor', 'mediocampista', 'delantero'])

export const playerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  number: z.number().int().positive().nullable(),
  position: playerPositionSchema,
  category: teamCategorySchema,
})
