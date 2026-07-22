import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DEFAULT_FOOTBALL_FORMAT, isFootballFormat } from '@/config/championships-source.config'
import type { StatisticsScope } from '../types/statistics'

const MODALIDAD_PARAM = 'modalidad'

export type StatisticsScopeState = {
  readonly scope: StatisticsScope
  readonly setScope: (scope: StatisticsScope) => void
}

/**
 * Reads and writes the Statistics scope from the URL. Defaults to F8; an invalid
 * `modalidad` falls back to F8. To keep F8 URLs clean the param is only written
 * for F5. Scope changes push history so back/forward work.
 */
export function useStatisticsScope(): StatisticsScopeState {
  const [searchParams, setSearchParams] = useSearchParams()
  const modalidad = searchParams.get(MODALIDAD_PARAM)
  const scope: StatisticsScope = isFootballFormat(modalidad) ? modalidad : DEFAULT_FOOTBALL_FORMAT

  const setScope = useCallback(
    (next: StatisticsScope) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          if (next === DEFAULT_FOOTBALL_FORMAT) params.delete(MODALIDAD_PARAM)
          else params.set(MODALIDAD_PARAM, next)
          return params
        },
        { replace: false, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  return { scope, setScope }
}
