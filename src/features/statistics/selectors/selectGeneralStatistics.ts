import type { Championship } from '@/features/championships/types/championships'
import type { GeneralStatistics } from '../types/statistics'
import { collectPlayedMatches } from '../utils/collectMatches'
import { selectAchievements } from './selectAchievements'

/**
 * Aggregates the headline statistics for a format from its championships.
 *
 * Only played matches are counted, so `matchesPlayed === won + drawn + lost`.
 * Rates and averages are `undefined` when there are no matches (never `NaN`).
 */
export function selectGeneralStatistics(
  all: readonly Championship[],
  published: readonly Championship[],
): GeneralStatistics {
  const played = collectPlayedMatches(all)

  let won = 0
  let drawn = 0
  let lost = 0
  let goalsFor = 0
  let goalsAgainst = 0
  let cleanSheets = 0

  for (const { match } of played) {
    if (match.outcome === 'win') won += 1
    else if (match.outcome === 'draw') drawn += 1
    else if (match.outcome === 'loss') lost += 1
    goalsFor += match.goalsFor ?? 0
    goalsAgainst += match.goalsAgainst ?? 0
    if (match.goalsAgainst === 0) cleanSheets += 1
  }

  const matchesPlayed = won + drawn + lost
  const tournamentsPlayed = published.filter((championship) =>
    championship.matches.some(
      (match) =>
        (match.outcome === 'win' || match.outcome === 'draw' || match.outcome === 'loss') &&
        match.goalsFor !== undefined &&
        match.goalsAgainst !== undefined,
    ),
  ).length

  const achievements = selectAchievements(published)

  return {
    tournamentsPlayed,
    tournamentsRegistered: published.length,
    titles: achievements.titles,
    goldTitles: achievements.goldTitles,
    silverTitles: achievements.silverTitles,
    runnerUpFinishes: achievements.runnerUpFinishes,
    goldRunnerUpFinishes: achievements.goldRunnerUpFinishes,
    silverRunnerUpFinishes: achievements.silverRunnerUpFinishes,
    semifinalFinishes: achievements.semifinalFinishes,
    quarterfinalFinishes: achievements.quarterfinalFinishes,
    matchesPlayed,
    matchesWon: won,
    matchesDrawn: drawn,
    matchesLost: lost,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    cleanSheets,
    ...(matchesPlayed > 0
      ? {
          winRate: won / matchesPlayed,
          goalsForPerMatch: goalsFor / matchesPlayed,
          goalsAgainstPerMatch: goalsAgainst / matchesPlayed,
          cleanSheetRate: cleanSheets / matchesPlayed,
        }
      : {}),
  }
}
