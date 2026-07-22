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
export function selectGeneralStatistics(championships: readonly Championship[]): GeneralStatistics {
  const played = collectPlayedMatches(championships)

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
  const tournamentsPlayed = championships.filter((championship) =>
    championship.matches.some(
      (match) =>
        (match.outcome === 'win' || match.outcome === 'draw' || match.outcome === 'loss') &&
        match.goalsFor !== undefined &&
        match.goalsAgainst !== undefined,
    ),
  ).length

  const achievements = selectAchievements(championships)

  return {
    tournamentsPlayed,
    tournamentsRegistered: championships.length,
    titles: achievements.titles,
    goldTitles: achievements.goldTitles,
    silverTitles: achievements.silverTitles,
    otherTitles: achievements.otherTitles,
    runnerUpFinishes: achievements.runnerUpFinishes,
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
