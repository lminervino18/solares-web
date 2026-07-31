import { routes } from '@/constants/routes'
import type { GoalVideo } from '../types/goals'
import { ALL_FILTER, type GoalFilters } from '../selectors/selectFilteredGoals'

export const GOAL_PARAM = 'gol'
export const FORMAT_PARAM = 'modalidad'
export const COMPETITION_PARAM = 'torneo'
export const SCORER_PARAM = 'jugador'
export const DENSITY_PARAM = 'vista'

export const DEFAULT_GOAL_FORMAT = 'f8'

/**
 * Builds the canonical shareable URL for a goal.
 *
 * `/goles` is always the destination, even when the player was opened from a
 * championship, so a shared link lands on the section that owns the gallery.
 * Filters are only included when they add context.
 */
export function buildGoalShareUrl(
  goal: GoalVideo,
  filters: Pick<GoalFilters, 'competitionId' | 'scorerId'>,
  origin: string,
): string {
  const params = new URLSearchParams()
  if (goal.format !== DEFAULT_GOAL_FORMAT) params.set(FORMAT_PARAM, goal.format)
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
