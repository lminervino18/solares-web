import type { GoalFormat, GoalVideo } from '../types/goals'

export const ALL_FILTER = 'all'

export type GoalFilters = {
  readonly format: GoalFormat
  readonly competitionId: string
  readonly scorerId: string
}

/**
 * Applies the gallery filters with AND logic: a goal is kept only when it
 * matches the active format and every non-`all` filter. F8 and F5 goals are
 * never mixed.
 */
export function selectFilteredGoals(
  goals: readonly GoalVideo[],
  filters: GoalFilters,
): readonly GoalVideo[] {
  return goals.filter((goal) => {
    if (goal.format !== filters.format) return false
    if (filters.competitionId !== ALL_FILTER && goal.competition.id !== filters.competitionId) {
      return false
    }
    if (filters.scorerId !== ALL_FILTER && goal.scorer.id !== filters.scorerId) return false
    return true
  })
}

export function selectGoalsByFormat(
  goals: readonly GoalVideo[],
  format: GoalFormat,
): readonly GoalVideo[] {
  return goals.filter((goal) => goal.format === format)
}

export function selectGoalsByCompetition(
  goals: readonly GoalVideo[],
  competitionId: string,
): readonly GoalVideo[] {
  return goals.filter((goal) => goal.competition.id === competitionId)
}

export function selectGoalsByScorer(
  goals: readonly GoalVideo[],
  scorerId: string,
): readonly GoalVideo[] {
  return goals.filter((goal) => goal.scorer.id === scorerId)
}

/**
 * Goals shown inside a championship: the format and the championship id must
 * both match, so a goal never leaks between formats or editions.
 */
export function selectGoalsByChampionship(
  goals: readonly GoalVideo[],
  format: GoalFormat,
  championshipId: string,
): readonly GoalVideo[] {
  return goals.filter(
    (goal) => goal.format === format && goal.competition.championshipId === championshipId,
  )
}
