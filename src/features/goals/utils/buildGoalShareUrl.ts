import { DEFAULT_FOOTBALL_FORMAT } from '@/config/football-format'
import { QUERY_PARAMS, writeFormatParam } from '@/config/query-params'
import { routes } from '@/constants/routes'
import type { GoalVideo } from '../types/goals'
import { ALL_FILTER, type GoalFilters } from '../selectors/selectFilteredGoals'

export const GOAL_PARAM = QUERY_PARAMS.goal
export const FORMAT_PARAM = QUERY_PARAMS.format
export const COMPETITION_PARAM = QUERY_PARAMS.championship
export const SCORER_PARAM = QUERY_PARAMS.scorer
export const DENSITY_PARAM = QUERY_PARAMS.density

export const DEFAULT_GOAL_FORMAT = DEFAULT_FOOTBALL_FORMAT

export function buildGoalShareUrl(
  goal: GoalVideo,
  filters: Pick<GoalFilters, 'competitionId' | 'scorerId'>,
  origin: string,
): string {
  const params = new URLSearchParams()
  writeFormatParam(params, goal.format)
  if (filters.competitionId !== ALL_FILTER) params.set(COMPETITION_PARAM, goal.competition.slug)
  if (filters.scorerId !== ALL_FILTER) params.set(SCORER_PARAM, goal.scorer.slug)
  params.set(GOAL_PARAM, goal.id)

  return `${origin.replace(/\/$/, '')}${routes.goals}?${params.toString()}`
}

export function buildGoalShareText(goal: GoalVideo): string {
  return `Gol de ${goal.scorer.name} en ${goal.competition.name}`
}

export function buildGoalDownloadName(goal: GoalVideo): string {
  const parts = ['solares', goal.format, goal.competition.slug, goal.scorer.slug]
  return `${parts.join('-')}.${goal.cloudinary.format}`
}
