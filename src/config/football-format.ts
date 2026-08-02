/**
 * The one football format union in the project.
 *
 * F8 and F5 are different sports: their championships, matches, goals and
 * statistics are never combined. Every feature that scopes content by format
 * imports this module instead of declaring its own union.
 */

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
