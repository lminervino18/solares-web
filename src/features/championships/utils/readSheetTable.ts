import type { GvizCell, GvizTable } from '../schemas/googleVisualization.schema'
import { normalizeCellValue, toCellString } from './normalizeCellValue'

export type SheetRow = {
  readonly index: number
  readonly cells: ReadonlyMap<string, GvizCell>
}

export type SheetData = {
  readonly headers: readonly string[]
  readonly rows: readonly SheetRow[]
}

function headerKey(value: string | undefined, fallbackIndex: number): string {
  const normalized = normalizeCellValue(value)
  return normalized ?? `col-${fallbackIndex}`
}

/**
 * Reads a gviz table into header-keyed rows.
 *
 * When `headerInColumns` is true the column labels are the headers and every
 * table row is data. Otherwise the first table row holds the headers and the
 * remaining rows are data. Fully empty rows are skipped.
 */
export function readSheetTable(table: GvizTable, headerInColumns: boolean): SheetData {
  let headers: string[]
  let dataRows: GvizTable['rows']

  if (headerInColumns) {
    headers = table.cols.map((col, index) => headerKey(col.label, index))
    dataRows = table.rows
  } else {
    const [headerRow, ...rest] = table.rows
    headers = (headerRow?.c ?? []).map((cell, index) =>
      headerKey(cell ? (cell.f ?? toCellString(cell.v)) : undefined, index),
    )
    dataRows = rest
  }

  const rows: SheetRow[] = []
  dataRows.forEach((row, rowIndex) => {
    const cells = new Map<string, GvizCell>()
    let hasValue = false
    row.c.forEach((cell, cellIndex) => {
      const header = headers[cellIndex]
      if (header === undefined || cell === null) return
      if (cell.v === null || cell.v === undefined) {
        if (cell.f === undefined) return
      }
      cells.set(header, cell)
      hasValue = true
    })
    if (hasValue) {
      rows.push({ index: rowIndex, cells })
    }
  })

  return { headers, rows }
}

export function readString(row: SheetRow, header: string): string | undefined {
  const cell = row.cells.get(header)
  if (!cell) return undefined
  if (cell.f !== undefined) return normalizeCellValue(cell.f)
  return normalizeCellValue(toCellString(cell.v))
}

export function readRawValue(row: SheetRow, header: string): unknown {
  return row.cells.get(header)?.v
}

/**
 * Reads a numeric cell, distinguishing a real zero from an empty or invalid
 * cell (which return `undefined`).
 */
export function readNumber(row: SheetRow, header: string): number | undefined {
  const cell = row.cells.get(header)
  if (!cell) return undefined
  if (typeof cell.v === 'number' && Number.isFinite(cell.v)) return cell.v
  const text = normalizeCellValue(cell.f ?? toCellString(cell.v))
  if (text === undefined) return undefined
  const parsed = Number(text.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : undefined
}
