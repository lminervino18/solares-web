import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  DEFAULT_FOOTBALL_FORMAT,
  isFootballFormat,
  type FootballFormat,
} from '@/config/championships-source.config'

export type ChampionshipsUrlState = {
  readonly format: FootballFormat
  readonly torneoSlug?: string
  readonly setFormat: (format: FootballFormat) => void
  readonly setTorneo: (slug: string) => void
}

const MODALIDAD_PARAM = 'modalidad'
const TORNEO_PARAM = 'torneo'

/**
 * Reads and writes the Championships URL state.
 *
 * `modalidad` selects the football format and defaults to F8; an invalid value
 * falls back to F8 without error. To keep F8 URLs clean the `modalidad` param is
 * only written for F5 (`/campeonatos` is canonical F8). `torneo` holds the
 * selected championship slug. Format and championship changes push history so
 * back/forward work.
 */
export function useChampionshipsUrlState(): ChampionshipsUrlState {
  const [searchParams, setSearchParams] = useSearchParams()

  const modalidad = searchParams.get(MODALIDAD_PARAM)
  const format: FootballFormat = isFootballFormat(modalidad) ? modalidad : DEFAULT_FOOTBALL_FORMAT
  const torneoSlug = searchParams.get(TORNEO_PARAM) ?? undefined

  const setFormat = useCallback(
    (next: FootballFormat) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          params.delete(TORNEO_PARAM)
          if (next === DEFAULT_FOOTBALL_FORMAT) {
            params.delete(MODALIDAD_PARAM)
          } else {
            params.set(MODALIDAD_PARAM, next)
          }
          return params
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const setTorneo = useCallback(
    (slug: string) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          params.set(TORNEO_PARAM, slug)
          return params
        },
        // Keep the scroll position when switching championships so parts of the
        // section can be compared quickly without the page jumping to the top.
        { replace: false, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  return {
    format,
    ...(torneoSlug ? { torneoSlug } : {}),
    setFormat,
    setTorneo,
  }
}
