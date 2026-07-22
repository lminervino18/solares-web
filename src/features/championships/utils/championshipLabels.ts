import type { ChampionshipHonorType, FootballFormat, MatchOutcome } from '../types/championships'

export const FOOTBALL_FORMAT_LABEL: Record<FootballFormat, string> = {
  f8: 'F8',
  f5: 'F5',
}

export const FOOTBALL_FORMAT_LONG_LABEL: Record<FootballFormat, string> = {
  f8: 'Fútbol 8',
  f5: 'Fútbol 5',
}

export const HONOR_LABEL: Record<ChampionshipHonorType, string> = {
  'gold-champion': 'Campeón de Oro',
  'silver-champion': 'Campeón de Plata',
  'gold-runner-up': 'Subcampeón',
  'silver-runner-up': 'Subcampeón de Plata',
  semifinalist: 'Semifinalista',
  quarterfinalist: 'Cuartos de final',
  'group-stage': 'Fase de grupos',
  other: 'Participación',
  unknown: 'Resultado final pendiente',
}

export const OUTCOME_LABEL: Record<MatchOutcome, string> = {
  win: 'Ganado',
  draw: 'Empatado',
  loss: 'Perdido',
  pending: 'Pendiente',
  cancelled: 'Suspendido',
}

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

/**
 * Formats an ISO `YYYY-MM-DD` date as a Spanish day-month label. Returns
 * `undefined` for a missing or malformed value.
 */
export function formatMatchDate(date: string | undefined): string | undefined {
  if (!date) return undefined
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return undefined
  const day = Number(match[3])
  const monthIndex = Number(match[2]) - 1
  const month = MONTHS[monthIndex]
  if (!month) return undefined
  return `${day} de ${month} de ${match[1]}`
}
