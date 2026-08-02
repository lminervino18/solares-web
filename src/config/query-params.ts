import {
  DEFAULT_FOOTBALL_FORMAT,
  isFootballFormat,
  type FootballFormat,
} from '@/config/football-format'

/**
 * Shared query parameter names and the typed helpers that read and write them.
 *
 * The names are Spanish because they are part of the public, shareable URLs.
 * Championships, Statistics and Goals all scope by `modalidad`, so the parsing
 * and the "F8 is canonical without a param" rule live here once.
 */

export const QUERY_PARAMS = {
  format: 'modalidad',
  championship: 'torneo',
  scorer: 'jugador',
  goal: 'gol',
  density: 'vista',
} as const

export type QueryParamName = (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS]

/** Reads `modalidad`, falling back to F8 for a missing or invalid value. */
export function readFormatParam(params: URLSearchParams): FootballFormat {
  const value = params.get(QUERY_PARAMS.format)
  return isFootballFormat(value) ? value : DEFAULT_FOOTBALL_FORMAT
}

/**
 * Writes `modalidad` in place, deleting it for the default format so F8 URLs
 * stay clean and canonical.
 */
export function writeFormatParam(params: URLSearchParams, format: FootballFormat): void {
  if (format === DEFAULT_FOOTBALL_FORMAT) params.delete(QUERY_PARAMS.format)
  else params.set(QUERY_PARAMS.format, format)
}
