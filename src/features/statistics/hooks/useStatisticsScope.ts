import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { readFormatParam, writeFormatParam } from '@/config/query-params'
import type { StatisticsScope } from '../types/statistics'

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
  const scope: StatisticsScope = readFormatParam(searchParams)

  const setScope = useCallback(
    (next: StatisticsScope) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          writeFormatParam(params, next)
          return params
        },
        { replace: false, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  return { scope, setScope }
}
