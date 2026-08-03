import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { FootballFormat } from '@/config/football-format'
import { QUERY_PARAMS, readFormatParam, writeFormatParam } from '@/config/query-params'

export type ChampionshipsUrlState = {
  readonly format: FootballFormat
  readonly torneoSlug?: string
  readonly setFormat: (format: FootballFormat) => void
  readonly setTorneo: (slug: string) => void
}

export function useChampionshipsUrlState(): ChampionshipsUrlState {
  const [searchParams, setSearchParams] = useSearchParams()

  const format = readFormatParam(searchParams)
  const torneoSlug = searchParams.get(QUERY_PARAMS.championship) ?? undefined

  const setFormat = useCallback(
    (next: FootballFormat) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          params.delete(QUERY_PARAMS.championship)
          writeFormatParam(params, next)
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
          params.set(QUERY_PARAMS.championship, slug)
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
