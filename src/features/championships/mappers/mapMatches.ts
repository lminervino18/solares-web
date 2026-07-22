import type { MatchOutcome } from '../types/championships'
import { parseSheetDate } from '../utils/parseSheetDate'
import {
  readNumber,
  readRawValue,
  readString,
  type SheetData,
  type SheetRow,
} from '../utils/readSheetTable'

export type RawMatch = {
  readonly championshipName: string
  readonly sourceOrder: number
  readonly opponent: string
  readonly outcome: MatchOutcome
  readonly goalsFor?: number
  readonly goalsAgainst?: number
  readonly scoreLabel?: string
  readonly stage?: string
  readonly venue?: string
  readonly date?: string
  readonly isFinal: boolean
  readonly scorersRaw?: string
}

const MATCH_HEADERS = {
  opponent: 'Rival',
  result: 'Resultado',
  goalsFor: 'Goles a favor',
  goalsAgainst: 'Goles encontra',
  venue: 'Sede',
  championship: 'Torneo',
  stage: 'Fase',
  scorers: 'Goleadores',
  date: 'Fecha',
} as const

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function mapOutcome(
  result: string | undefined,
  goalsFor: number | undefined,
  goalsAgainst: number | undefined,
): MatchOutcome {
  if (result) {
    const value = normalize(result)
    if (value.includes('victoria') || value.includes('ganado')) return 'win'
    if (value.includes('derrota') || value.includes('perdido')) return 'loss'
    if (value.includes('empate')) return 'draw'
    if (value.includes('suspend') || value.includes('cancel')) return 'cancelled'
    if (value.includes('pendiente')) return 'pending'
  }
  if (goalsFor !== undefined && goalsAgainst !== undefined) {
    if (goalsFor > goalsAgainst) return 'win'
    if (goalsFor < goalsAgainst) return 'loss'
    return 'draw'
  }
  return 'pending'
}

function mapRow(row: SheetRow): RawMatch | undefined {
  const championshipName = readString(row, MATCH_HEADERS.championship)
  const opponent = readString(row, MATCH_HEADERS.opponent)
  if (!championshipName || !opponent) return undefined

  const goalsFor = readNumber(row, MATCH_HEADERS.goalsFor)
  const goalsAgainst = readNumber(row, MATCH_HEADERS.goalsAgainst)
  const result = readString(row, MATCH_HEADERS.result)
  const stage = readString(row, MATCH_HEADERS.stage)
  const scoreLabel =
    goalsFor !== undefined && goalsAgainst !== undefined ? `${goalsFor}-${goalsAgainst}` : undefined

  const venue = readString(row, MATCH_HEADERS.venue)
  const date = parseSheetDate(
    readRawValue(row, MATCH_HEADERS.date) ?? row.cells.get(MATCH_HEADERS.date)?.f,
  )
  const scorersRaw = readString(row, MATCH_HEADERS.scorers)

  return {
    championshipName,
    sourceOrder: row.index,
    opponent,
    outcome: mapOutcome(result, goalsFor, goalsAgainst),
    isFinal: stage ? normalize(stage) === 'final' : false,
    ...(goalsFor !== undefined ? { goalsFor } : {}),
    ...(goalsAgainst !== undefined ? { goalsAgainst } : {}),
    ...(scoreLabel ? { scoreLabel } : {}),
    ...(stage ? { stage } : {}),
    ...(venue ? { venue } : {}),
    ...(date ? { date } : {}),
    ...(scorersRaw ? { scorersRaw } : {}),
  }
}

export function mapMatches(sheet: SheetData): readonly RawMatch[] {
  return sheet.rows.map(mapRow).filter((match): match is RawMatch => match !== undefined)
}
