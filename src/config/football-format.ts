export type FootballFormat = 'f8' | 'f5'

export const FOOTBALL_FORMATS = ['f8', 'f5'] as const

export const DEFAULT_FOOTBALL_FORMAT: FootballFormat = 'f8'

export const FOOTBALL_FORMAT_LABEL: Record<FootballFormat, string> = {
  f8: 'F8',
  f5: 'F5',
}

export const FOOTBALL_FORMAT_LONG_LABEL: Record<FootballFormat, string> = {
  f8: 'Fútbol 8',
  f5: 'Fútbol 5',
}

export function isFootballFormat(value: unknown): value is FootballFormat {
  return value === 'f8' || value === 'f5'
}
