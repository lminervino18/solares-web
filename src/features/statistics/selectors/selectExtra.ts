import {
  MIN_MATCHES_FOR_RATE_RANKING,
  type ExtraStatistics,
  type HistoricalScorer,
  type TournamentStatistics,
} from '../types/statistics'

export function selectExtra(
  scorers: readonly HistoricalScorer[],
  tournaments: readonly TournamentStatistics[],
): ExtraStatistics {
  const attributedGoals = scorers.reduce((total, scorer) => total + scorer.goals, 0)
  const topN = (count: number) =>
    scorers.slice(0, count).reduce((total, scorer) => total + scorer.goals, 0)

  const bestTournamentByWinRate = tournaments
    .filter((tournament) => tournament.matches >= MIN_MATCHES_FOR_RATE_RANKING)
    .slice()
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))[0]

  const topScoringTournament = tournaments.slice().sort((a, b) => b.goalsFor - a.goalsFor)[0]

  return {
    uniqueScorers: scorers.length,
    concentration: {
      attributedGoals,
      ...(attributedGoals > 0
        ? {
            topScorerShare: topN(1) / attributedGoals,
            topThreeShare: topN(3) / attributedGoals,
            topTenShare: topN(10) / attributedGoals,
          }
        : {}),
    },
    ...(bestTournamentByWinRate ? { bestTournamentByWinRate } : {}),
    ...(topScoringTournament ? { topScoringTournament } : {}),
  }
}
