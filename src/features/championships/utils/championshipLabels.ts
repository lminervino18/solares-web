import type { ChampionshipHonorType, MatchOutcome } from '../types/championships'

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
