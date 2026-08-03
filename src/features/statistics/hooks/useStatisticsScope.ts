import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { readFormatParam, writeFormatParam } from '@/config/query-params'
import type { StatisticsScope } from '../types/statistics'

export type StatisticsScopeState = {
  readonly scope: StatisticsScope
  readonly setScope: (scope: StatisticsScope) => void
}

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
