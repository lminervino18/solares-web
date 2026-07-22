import type { ChampionshipsByFormat } from '@/features/championships/types/championships'
import type { StatisticsScope, StatisticsViewModel } from '../types/statistics'
import { selectAchievements } from './selectAchievements'
import { selectAnnual } from './selectAnnual'
import { selectCleanSheets } from './selectCleanSheets'
import { selectExtra } from './selectExtra'
import { selectGeneralStatistics } from './selectGeneralStatistics'
import { selectHistoricalScorers, selectKnockoutScorers } from './selectHistoricalScorers'
import { selectKickoffTimes } from './selectKickoffTimes'
import { selectOpponents } from './selectOpponents'
import { selectRecords } from './selectRecords'
import { selectStreaks } from './selectStreaks'
import { selectTournamentStatistics } from './selectTournamentStatistics'
import { selectVenues } from './selectVenues'

/**
 * Builds the full statistics view model for a single format from the shared
 * normalized championship data. Pure: computed once per (data, scope) pair.
 */
export function buildStatisticsViewModel(
  data: ChampionshipsByFormat,
  scope: StatisticsScope,
): StatisticsViewModel {
  const championships = data[scope]
  const scorers = selectHistoricalScorers(championships)
  const tournaments = selectTournamentStatistics(championships)

  return {
    scope,
    general: selectGeneralStatistics(championships),
    achievements: selectAchievements(championships),
    scorers,
    knockoutScorers: selectKnockoutScorers(scorers),
    tournaments,
    streaks: selectStreaks(championships),
    opponents: selectOpponents(championships),
    venues: selectVenues(championships),
    kickoffTimes: selectKickoffTimes(championships),
    records: selectRecords(championships),
    cleanSheets: selectCleanSheets(championships),
    annual: selectAnnual(championships),
    extra: selectExtra(scorers, tournaments),
  }
}
