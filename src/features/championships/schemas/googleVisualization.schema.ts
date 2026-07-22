import { z } from 'zod'

export const gvizCellSchema = z
  .object({
    v: z.unknown().optional(),
    f: z.string().optional(),
  })
  .nullable()

export const gvizColumnSchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  type: z.string().optional(),
})

export const gvizRowSchema = z.object({
  c: z.array(gvizCellSchema),
})

export const gvizTableSchema = z.object({
  cols: z.array(gvizColumnSchema),
  rows: z.array(gvizRowSchema),
  parsedNumHeaders: z.number().optional(),
})

export const gvizResponseSchema = z.object({
  version: z.string().optional(),
  reqId: z.string().optional(),
  status: z.string(),
  errors: z
    .array(
      z.object({
        reason: z.string().optional(),
        message: z.string().optional(),
        detailed_message: z.string().optional(),
      }),
    )
    .optional(),
  table: gvizTableSchema.optional(),
})

export type GvizResponse = z.infer<typeof gvizResponseSchema>
export type GvizTable = z.infer<typeof gvizTableSchema>
export type GvizCell = z.infer<typeof gvizCellSchema>
