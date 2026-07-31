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
  /** True when the URL named a goal that is not in the manifest. */
  readonly missingGoal: boolean
  /** True when the URL must be rewritten because it held stale values. */
  readonly needsCleanup: boolean
}

function isGoalFormat(value: string | null): value is GoalFormat {
  return value === 'f8' || value === 'f5'
}

function isGoalDensity(value: string | null): value is GoalDensity {
  return value !== null && (GOAL_DENSITIES as readonly string[]).includes(value)
}

/**
 * Resolves the goals URL into the state the gallery should actually render.
 *
 * A shared `gol` link wins over the other parameters: the goal decides the
 * format, and any filter that would hide it is dropped instead of the goal. An
 * unknown goal id is reported so the caller can clean the URL and show a
 * discreet notice rather than an error.
 */
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

  // A shared goal must stay visible: only the filter that hides it is dropped.
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
    // An unknown goal is deliberately left in the URL: removing it immediately
    // would also remove the notice explaining what happened. Every filter and
    // navigation action already drops the parameter, so it self-heals on the
    // next interaction.
    needsCleanup: droppedFilter || staleFilter || staleFormat,
  }
}
