import {
  CHAMPIONSHIP_SHEETS,
  type ChampionshipSheetConfig,
} from '@/config/championships-source.config'
import { FOOTBALL_FORMATS, type FootballFormat } from '@/config/football-format'
import { mapChampionships } from '../mappers/mapChampionships'
import type { GvizTable } from '../schemas/googleVisualization.schema'
import type { Championship, ChampionshipsByFormat } from '../types/championships'
import { readSheetTable } from '../utils/readSheetTable'
import { fetchGoogleSheet } from './fetchGoogleSheet'

export type ChampionshipSheetTables = Readonly<Record<string, GvizTable>>

function findSheet(
  format: FootballFormat,
  purpose: ChampionshipSheetConfig['purpose'],
): ChampionshipSheetConfig {
  const sheet = CHAMPIONSHIP_SHEETS.find(
    (candidate) => candidate.format === format && candidate.purpose === purpose,
  )
  if (!sheet) {
    throw new Error(`Missing ${purpose} sheet for format ${format}`)
  }
  return sheet
}

function buildFormat(
  format: FootballFormat,
  tables: ChampionshipSheetTables,
): readonly Championship[] {
  const summaryConfig = findSheet(format, 'championships')
  const matchesConfig = findSheet(format, 'matches')

  const summaryTable = tables[summaryConfig.key]
  const matchesTable = tables[matchesConfig.key]
  if (!summaryTable || !matchesTable) {
    throw new Error(`Missing tables for format ${format}`)
  }

  const summarySheet = readSheetTable(summaryTable, summaryConfig.headerInColumns)
  const matchesSheet = readSheetTable(matchesTable, matchesConfig.headerInColumns)

  return mapChampionships(format, summarySheet, matchesSheet)
}

/**
 * Builds the format-grouped championship model from the four already-parsed
 * sheet tables. Pure: shared by the remote fetch path and the snapshot script.
 */
export function buildChampionshipsByFormat(tables: ChampionshipSheetTables): ChampionshipsByFormat {
  return {
    f8: buildFormat('f8', tables),
    f5: buildFormat('f5', tables),
  }
}

export type FetchChampionshipsOptions = {
  readonly signal?: AbortSignal
  readonly cacheBust?: number
  readonly fetchImpl?: typeof fetch
}

/**
 * Fetches the four public sheets in parallel and builds the championship model.
 * Always revalidates the source (`cache: 'no-store'`).
 */
export async function fetchChampionships(
  options: FetchChampionshipsOptions = {},
): Promise<ChampionshipsByFormat> {
  const entries = await Promise.all(
    CHAMPIONSHIP_SHEETS.map(async (sheet) => {
      const table = await fetchGoogleSheet(sheet.gid, {
        ...(options.signal ? { signal: options.signal } : {}),
        ...(options.cacheBust !== undefined ? { cacheBust: options.cacheBust } : {}),
        ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
      })
      return [sheet.key, table] as const
    }),
  )

  const tables: Record<string, GvizTable> = {}
  for (const [key, table] of entries) {
    tables[key] = table
  }

  return buildChampionshipsByFormat(tables)
}

export { FOOTBALL_FORMATS }
