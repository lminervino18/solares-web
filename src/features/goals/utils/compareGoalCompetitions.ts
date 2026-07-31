import { normalizeCompetitionKey } from '../data/goal-competition-aliases'
import type { GoalCompetition, GoalCompetitionType, GoalVideo } from '../types/goals'

/**
 * Competition and goal ordering.
 *
 * Source file timestamps only record when the clips were copied to disk, so
 * they cannot order goals across competitions that span several years. The real
 * chronology lives in the competition name, so competitions are ranked by
 * season and year, and file timestamps only break ties inside one competition.
 *
 * Official competitions come first (most recent first), then friendlies, then
 * preseason, matching the tournament filter order.
 */

const TYPE_RANK: Record<GoalCompetitionType, number> = {
  official: 0,
  friendly: 1,
  preseason: 2,
  other: 3,
}

const SEASON_RANK: Readonly<Record<string, number>> = {
  pretemporada: 0,
  apertura: 1,
  clausura: 2,
}

const YEAR_PATTERN = /\b(\d{4})\b/

export function competitionYear(name: string): number {
  const match = YEAR_PATTERN.exec(name)
  return match?.[1] === undefined ? 0 : Number(match[1])
}

export function competitionSeasonRank(name: string): number {
  const [season] = normalizeCompetitionKey(name).split(' ')
  return season === undefined ? 0 : (SEASON_RANK[season] ?? 0)
}

export function compareGoalCompetitions(a: GoalCompetition, b: GoalCompetition): number {
  const byType = TYPE_RANK[a.type] - TYPE_RANK[b.type]
  if (byType !== 0) return byType

  const byYear = competitionYear(b.name) - competitionYear(a.name)
  if (byYear !== 0) return byYear

  const bySeason = competitionSeasonRank(b.name) - competitionSeasonRank(a.name)
  if (bySeason !== 0) return bySeason

  // The id carries the format, so competitions sharing a name stay deterministic.
  return a.id.localeCompare(b.id, 'es-AR')
}

/**
 * Orders goals for the gallery: newest competition first, and inside a
 * competition the most recently added clip first. The stable id breaks ties so
 * the manifest and the rendered grid are deterministic.
 */
export function compareGoals(a: GoalVideo, b: GoalVideo): number {
  const byCompetition = compareGoalCompetitions(a.competition, b.competition)
  if (byCompetition !== 0) return byCompetition

  const byCreatedAt = b.source.createdAt.localeCompare(a.source.createdAt)
  if (byCreatedAt !== 0) return byCreatedAt

  return a.id.localeCompare(b.id)
}
