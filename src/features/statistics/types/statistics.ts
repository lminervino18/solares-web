import type { FootballFormat } from '@/config/championships-source.config'

export type { FootballFormat }

/**
 * The statistics scope. Only F8 and F5 exist; the two formats are never
 * combined into a single aggregate.
 */
export type StatisticsScope = FootballFormat

export type GeneralStatistics = {
  readonly tournamentsPlayed: number
  readonly tournamentsRegistered: number
  readonly titles: number
  readonly goldTitles: number
  readonly silverTitles: number
  readonly runnerUpFinishes: number
  readonly goldRunnerUpFinishes: number
  readonly silverRunnerUpFinishes: number
  readonly semifinalFinishes: number
  readonly quarterfinalFinishes: number
  readonly matchesPlayed: number
  readonly matchesWon: number
  readonly matchesDrawn: number
  readonly matchesLost: number
  readonly goalsFor: number
  readonly goalsAgainst: number
  readonly goalDifference: number
  readonly winRate?: number
  readonly goalsForPerMatch?: number
  readonly goalsAgainstPerMatch?: number
  readonly cleanSheets: number
  readonly cleanSheetRate?: number
}

export type HistoricalScorer = {
  readonly playerId: string
  readonly playerName: string
  readonly goals: number
  readonly rank: number
  readonly tournamentsWithGoals: number
  readonly knockoutGoals: number
}

export type StreakType = 'wins' | 'losses' | 'unbeaten' | 'winless' | 'scoring' | 'clean-sheets'

export type StreakRecord = {
  readonly type: StreakType
  readonly length: number
  readonly startDate?: string
  readonly endDate?: string
  readonly firstOpponent: string
  readonly lastOpponent: string
  readonly matchIds: readonly string[]
}

export type OpponentStatistics = {
  readonly opponentId: string
  readonly opponentName: string
  readonly played: number
  readonly won: number
  readonly drawn: number
  readonly lost: number
  readonly goalsFor: number
  readonly goalsAgainst: number
  readonly goalDifference: number
  readonly lastDate?: string
}

export type VenueStatistics = {
  readonly venueId: string
  readonly venueName: string
  readonly matches: number
  readonly wins: number
  readonly share: number
  readonly winRate?: number
}

export type KickoffTimeStatistics = {
  readonly time: string
  readonly matches: number
  readonly wins: number
  readonly share: number
  readonly winRate?: number
}

export type TournamentStatistics = {
  readonly championshipId: string
  readonly championshipName: string
  readonly slug: string
  readonly format: FootballFormat
  readonly matches: number
  readonly wins: number
  readonly draws: number
  readonly losses: number
  readonly goalsFor: number
  readonly goalsAgainst: number
  readonly goalDifference: number
  readonly cleanSheets: number
  readonly winRate?: number
}

export type MatchRecord = {
  readonly matchId: string
  readonly championshipId: string
  readonly championshipName: string
  readonly slug: string
  readonly format: FootballFormat
  readonly opponent: string
  readonly scoreLabel: string
  readonly goalsFor: number
  readonly goalsAgainst: number
  readonly date?: string
}

export type MatchRecords = {
  readonly biggestWin?: MatchRecord
  readonly biggestLoss?: MatchRecord
  readonly mostGoals?: MatchRecord
  readonly mostRecent?: MatchRecord
  readonly earliest?: MatchRecord
  readonly mostFrequentScore?: { readonly score: string; readonly count: number }
}

export type CleanSheetStatistics = {
  readonly total: number
  readonly rate?: number
  readonly bestTournament?: { readonly name: string; readonly slug: string; readonly count: number }
  readonly longestStreak: number
}

export type AnnualStatistics = {
  readonly year: number
  readonly matches: number
  readonly wins: number
  readonly draws: number
  readonly losses: number
  readonly goalsFor: number
  readonly goalsAgainst: number
  readonly titles: number
}

export type AchievementStatistics = {
  readonly titles: number
  readonly goldTitles: number
  readonly silverTitles: number
  readonly runnerUpFinishes: number
  readonly goldRunnerUpFinishes: number
  readonly silverRunnerUpFinishes: number
  readonly semifinalFinishes: number
  readonly quarterfinalFinishes: number
}

export type GoalConcentration = {
  readonly attributedGoals: number
  readonly topScorerShare?: number
  readonly topThreeShare?: number
  readonly topTenShare?: number
}

export type ExtraStatistics = {
  readonly uniqueScorers: number
  readonly concentration: GoalConcentration
  readonly bestTournamentByWinRate?: TournamentStatistics
  readonly topScoringTournament?: TournamentStatistics
}

export type StatisticsViewModel = {
  readonly scope: StatisticsScope
  readonly general: GeneralStatistics
  readonly achievements: AchievementStatistics
  readonly scorers: readonly HistoricalScorer[]
  readonly knockoutScorers: readonly HistoricalScorer[]
  readonly tournaments: readonly TournamentStatistics[]
  readonly streaks: readonly StreakRecord[]
  readonly opponents: readonly OpponentStatistics[]
  readonly venues: readonly VenueStatistics[]
  readonly kickoffTimes: readonly KickoffTimeStatistics[]
  readonly records: MatchRecords
  readonly cleanSheets: CleanSheetStatistics
  readonly annual: readonly AnnualStatistics[]
  readonly extra: ExtraStatistics
}

export const MIN_MATCHES_FOR_RATE_RANKING = 5
