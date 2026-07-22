import { toCellString } from './normalizeCellValue'

const GVIZ_DATE = /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/
const DMY_DATE = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * Parses a Google Visualization date cell into an ISO `YYYY-MM-DD` string.
 *
 * Accepts the raw gviz value (`Date(2022,3,4)`, month is 0-indexed) and the
 * formatted `d/m/yyyy` fallback. Returns `undefined` when the value is empty or
 * cannot be interpreted; it never guesses an ambiguous date.
 */
export function parseSheetDate(value: unknown): string | undefined {
  const text = toCellString(value)?.trim()
  if (text === undefined || text.length === 0) return undefined

  const gviz = GVIZ_DATE.exec(text)
  if (gviz) {
    const year = Number(gviz[1])
    const month = Number(gviz[2]) + 1
    const day = Number(gviz[3])
    if (month < 1 || month > 12 || day < 1 || day > 31) return undefined
    return `${year}-${pad(month)}-${pad(day)}`
  }

  const dmy = DMY_DATE.exec(text)
  if (dmy) {
    const day = Number(dmy[1])
    const month = Number(dmy[2])
    const year = Number(dmy[3])
    if (month < 1 || month > 12 || day < 1 || day > 31) return undefined
    return `${year}-${pad(month)}-${pad(day)}`
  }

  return undefined
}
