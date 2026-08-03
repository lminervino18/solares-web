import { useMemo } from 'react'

import {
  useChampionshipsData,
  type ChampionshipsDataState,
} from '@/features/championships/hooks/useChampionshipsData'
import type { ChampionshipsByFormat } from '@/features/championships/types/championships'
import { buildStatisticsViewModel } from '../selectors/buildStatisticsViewModel'
import type { StatisticsScope, StatisticsViewModel } from '../types/statistics'

const EMPTY_DATA: ChampionshipsByFormat = { f8: [], f5: [] }

export type UseStatisticsViewModelResult = {
  readonly state: ChampionshipsDataState
  readonly viewModel: StatisticsViewModel
  readonly refresh: () => void
  readonly isRefreshing: boolean
}

export function useStatisticsViewModel(scope: StatisticsScope): UseStatisticsViewModelResult {
  const { state, refresh, isRefreshing } = useChampionshipsData()
  const data = 'data' in state && state.data ? state.data : EMPTY_DATA
  const viewModel = useMemo(() => buildStatisticsViewModel(data, scope), [data, scope])

  return { state, viewModel, refresh, isRefreshing }
}
