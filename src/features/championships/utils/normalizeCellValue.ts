const COMBINING_MARKS = /[̀-ͯ]/g

/**
 * Converts a spreadsheet cell value (string, number or boolean) to a string.
 * Objects and other non-primitives return `undefined` rather than stringifying
 * to `[object Object]`.
 */
export function toCellString(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

export function normalizeCellValue(value: unknown): string | undefined {
  const text = toCellString(value)
  if (text === undefined) return undefined
  const normalized = text.normalize('NFC').replace(/\s+/g, ' ').trim()
  return normalized.length > 0 ? normalized : undefined
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
