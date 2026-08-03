import {
  DEFAULT_FOOTBALL_FORMAT,
  isFootballFormat,
  type FootballFormat,
} from '@/config/football-format'

export const QUERY_PARAMS = {
  format: 'modalidad',
  championship: 'torneo',
  scorer: 'jugador',
  goal: 'gol',
  density: 'vista',
} as const

export type QueryParamName = (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS]

export function readFormatParam(params: URLSearchParams): FootballFormat {
  const value = params.get(QUERY_PARAMS.format)
  return isFootballFormat(value) ? value : DEFAULT_FOOTBALL_FORMAT
}

export function writeFormatParam(params: URLSearchParams, format: FootballFormat): void {
  if (format === DEFAULT_FOOTBALL_FORMAT) params.delete(QUERY_PARAMS.format)
  else params.set(QUERY_PARAMS.format, format)
}
