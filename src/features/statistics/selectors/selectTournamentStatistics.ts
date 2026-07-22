import type { Championship } from '@/features/championships/types/championships'
import type { TournamentStatistics } from '../types/statistics'
import { isPlayedMatch } from '../utils/collectMatches'

/**
 * Builds per-championship statistics for a format, ordered most recent first
 * (as stored in the model). Clean sheets are counted from played matches.
 */
export function selectTournamentStatistics(
  championships: readonly Championship[],
): readonly TournamentStatistics[] {
  return championships.map((championship) => {
    const cleanSheets = championship.matches.filter(
      (match) => isPlayedMatch(match) && match.goalsAgainst === 0,
    ).length
    const { stats } = championship

    return {
      championshipId: championship.id,
      championshipName: championship.name,
      slug: championship.slug,
      format: championship.format,
      matches: stats.played,
      wins: stats.won,
      draws: stats.drawn,
      losses: stats.lost,
      goalsFor: stats.goalsFor,
      goalsAgainst: stats.goalsAgainst,
      goalDifference: stats.goalDifference,
      cleanSheets,
      ...(stats.played > 0 ? { winRate: stats.won / stats.played } : {}),
    }
  })
}
