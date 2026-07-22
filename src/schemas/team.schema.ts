import { z } from 'zod'

export const teamCategorySchema = z.enum(['masculino', 'femenino', 'mixto'])

export const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: teamCategorySchema,
})
