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
  // Pooled match statistics use all championships (including unpublished
  // editions such as "Verano"); tournament counts, titles and the per-tournament
  // comparison use only published championships.
  const all = data[scope]
  const published = all.filter((championship) => championship.published)

  const scorers = selectHistoricalScorers(all)
  const tournaments = selectTournamentStatistics(published)

  return {
    scope,
    general: selectGeneralStatistics(all, published),
    achievements: selectAchievements(published),
    scorers,
    knockoutScorers: selectKnockoutScorers(scorers),
    tournaments,
    streaks: selectStreaks(all),
    opponents: selectOpponents(all),
    venues: selectVenues(all),
    kickoffTimes: selectKickoffTimes(all),
    records: selectRecords(all),
    cleanSheets: selectCleanSheets(all),
    annual: selectAnnual(all),
    extra: selectExtra(scorers, tournaments),
  }
}
