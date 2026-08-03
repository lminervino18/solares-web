import type { GoalFormat, GoalVideo } from '../types/goals'
import { ALL_FILTER } from '../selectors/selectFilteredGoals'
import {
  COMPETITION_PARAM,
  DEFAULT_GOAL_FORMAT,
  DENSITY_PARAM,
  FORMAT_PARAM,
  GOAL_PARAM,
  SCORER_PARAM,
} from './buildGoalShareUrl'

export const GOAL_DENSITIES = ['large', 'medium', 'compact'] as const

export type GoalDensity = (typeof GOAL_DENSITIES)[number]

export const DEFAULT_GOAL_DENSITY: GoalDensity = 'medium'

export type ResolvedGoalUrlState = {
  readonly format: GoalFormat
  readonly competitionId: string
  readonly scorerId: string
  readonly goalId?: string
  readonly density?: GoalDensity
  readonly missingGoal: boolean
  readonly needsCleanup: boolean
}

function isGoalFormat(value: string | null): value is GoalFormat {
  return value === 'f8' || value === 'f5'
}

function isGoalDensity(value: string | null): value is GoalDensity {
  return value !== null && (GOAL_DENSITIES as readonly string[]).includes(value)
}

export function parseGoalUrlState(
  goals: readonly GoalVideo[],
  params: URLSearchParams,
): ResolvedGoalUrlState {
  const requestedGoalId = params.get(GOAL_PARAM) ?? undefined
  const goal =
    requestedGoalId === undefined
      ? undefined
      : goals.find((candidate) => candidate.id === requestedGoalId)
  const missingGoal = requestedGoalId !== undefined && goal === undefined

  const formatParam = params.get(FORMAT_PARAM)
  const requestedFormat: GoalFormat = isGoalFormat(formatParam) ? formatParam : DEFAULT_GOAL_FORMAT
  const format = goal?.format ?? requestedFormat

  const competitionSlug = params.get(COMPETITION_PARAM)
  const scorerSlug = params.get(SCORER_PARAM)

  const competitionExists =
    competitionSlug !== null &&
    goals.some((item) => item.format === format && item.competition.slug === competitionSlug)
  const scorerExists =
    scorerSlug !== null &&
    goals.some((item) => item.format === format && item.scorer.slug === scorerSlug)

  let competitionId = competitionExists ? `${format}-${competitionSlug}` : ALL_FILTER
  let scorerId = scorerExists && scorerSlug !== null ? scorerSlug : ALL_FILTER

  let droppedFilter = false
  if (goal !== undefined) {
    if (competitionId !== ALL_FILTER && goal.competition.id !== competitionId) {
      competitionId = ALL_FILTER
      droppedFilter = true
    }
    if (scorerId !== ALL_FILTER && goal.scorer.id !== scorerId) {
      scorerId = ALL_FILTER
      droppedFilter = true
    }
  }

  const staleFilter =
    (competitionSlug !== null && !competitionExists) || (scorerSlug !== null && !scorerExists)
  const staleFormat = goal !== undefined && isGoalFormat(formatParam) && formatParam !== goal.format

  const densityParam = params.get(DENSITY_PARAM)

  return {
    format,
    competitionId,
    scorerId,
    ...(goal === undefined ? {} : { goalId: goal.id }),
    ...(isGoalDensity(densityParam) ? { density: densityParam } : {}),
    missingGoal,
    needsCleanup: droppedFilter || staleFilter || staleFormat,
  }
}
