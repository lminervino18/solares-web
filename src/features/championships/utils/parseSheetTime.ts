import { toCellString } from './normalizeCellValue'

const GVIZ_DATETIME = /^Date\(\d+,\d+,\d+,(\d+),(\d+)(?:,\d+)?\)$/
const CLOCK = /^(\d{1,2}):(\d{2})(?::\d{2})?$/

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function parseSheetTime(value: unknown): string | undefined {
  const text = toCellString(value)?.trim()
  if (text === undefined || text.length === 0) return undefined

  const gviz = GVIZ_DATETIME.exec(text)
  if (gviz) {
    const hours = Number(gviz[1])
    const minutes = Number(gviz[2])
    if (hours > 23 || minutes > 59) return undefined
    return `${pad(hours)}:${pad(minutes)}`
  }

  const clock = CLOCK.exec(text)
  if (clock) {
    const hours = Number(clock[1])
    const minutes = Number(clock[2])
    if (hours > 23 || minutes > 59) return undefined
    return `${pad(hours)}:${pad(minutes)}`
  }

  return undefined
}
