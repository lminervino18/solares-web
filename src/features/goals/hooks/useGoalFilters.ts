import { useCallback, useMemo, useState } from 'react'

import type { GoalFormat, GoalVideo } from '../types/goals'
import { ALL_FILTER, selectFilteredGoals } from '../selectors/selectFilteredGoals'
import { selectGoalCompetitionOptions } from '../selectors/selectGoalCompetitionOptions'
import { selectGoalScorerOptions } from '../selectors/selectGoalScorerOptions'
import { DEFAULT_GOAL_DENSITY, type GoalDensity } from '../utils/parseGoalUrlState'
import { DEFAULT_GOAL_FORMAT } from '../utils/buildGoalShareUrl'
import { useGoalUrlState } from './useGoalUrlState'

const DENSITY_STORAGE_KEY = 'solares:goals:density'

export type UseGoalFiltersOptions = {
  readonly goals: readonly GoalVideo[]
  readonly syncUrl: boolean
  readonly fixedFormat?: GoalFormat
  readonly fixedCompetitionId?: string
}

/**
 * Resolves the gallery state for both of its hosts.
 *
 * On the Goles page the state lives in the URL so any view can be shared. When
 * embedded in a page that already owns the query string, the same state is kept
 * locally instead, and a fixed format or competition simply pins those values.
 * The density preference is remembered across visits when storage is available.
 */
export function useGoalFilters({
  goals,
  syncUrl,
  fixedFormat,
  fixedCompetitionId,
}: UseGoalFiltersOptions) {
  const urlState = useGoalUrlState(goals, { enabled: syncUrl })

  const [localFormat, setLocalFormat] = useState<GoalFormat>(fixedFormat ?? DEFAULT_GOAL_FORMAT)
  const [localCompetitionId, setLocalCompetitionId] = useState(fixedCompetitionId ?? ALL_FILTER)
  const [localScorerId, setLocalScorerId] = useState(ALL_FILTER)
  const [localGoalId, setLocalGoalId] = useState<string | undefined>(undefined)
  // Read once during initialisation: the page still works when storage is
  // unavailable, it just falls back to the default density.
  const [storedDensity, setStoredDensity] = useState<GoalDensity>(() => {
    try {
      const saved = window.localStorage.getItem(DENSITY_STORAGE_KEY)
      if (saved === 'large' || saved === 'medium' || saved === 'compact') return saved
    } catch {
      // Ignored on purpose.
    }
    return DEFAULT_GOAL_DENSITY
  })

  const format = fixedFormat ?? (syncUrl ? urlState.format : localFormat)
  const competitionId =
    fixedCompetitionId ?? (syncUrl ? urlState.competitionId : localCompetitionId)
  const scorerId = syncUrl ? urlState.scorerId : localScorerId
  const goalId = syncUrl ? urlState.goalId : localGoalId
  const density = (syncUrl ? urlState.density : undefined) ?? storedDensity

  const formatGoals = useMemo(() => goals.filter((goal) => goal.format === format), [goals, format])

  // Each filter is scoped by the other one, so its options and counts always
  // describe the current view and no choice can lead to an empty result.
  const competitionScope = useMemo(
    () =>
      scorerId === ALL_FILTER
        ? formatGoals
        : formatGoals.filter((goal) => goal.scorer.id === scorerId),
    [formatGoals, scorerId],
  )

  const scorerScope = useMemo(
    () =>
      competitionId === ALL_FILTER
        ? formatGoals
        : formatGoals.filter((goal) => goal.competition.id === competitionId),
    [formatGoals, competitionId],
  )

  const competitionOptions = useMemo(
    () => selectGoalCompetitionOptions(competitionScope),
    [competitionScope],
  )

  const scorerOptions = useMemo(() => selectGoalScorerOptions(scorerScope), [scorerScope])

  const filteredGoals = useMemo(
    () => selectFilteredGoals(goals, { format, competitionId, scorerId }),
    [goals, format, competitionId, scorerId],
  )

  const setFormat = useCallback(
    (next: GoalFormat) => {
      if (syncUrl) urlState.setFormat(next)
      else {
        setLocalFormat(next)
        setLocalCompetitionId(ALL_FILTER)
        setLocalScorerId(ALL_FILTER)
        setLocalGoalId(undefined)
      }
    },
    [syncUrl, urlState],
  )

  const setCompetition = useCallback(
    (nextId: string, slug?: string) => {
      if (syncUrl) urlState.setCompetition(nextId, slug)
      else {
        setLocalCompetitionId(nextId)
        setLocalGoalId(undefined)
      }
    },
    [syncUrl, urlState],
  )

  const setScorer = useCallback(
    (nextId: string, slug?: string) => {
      if (syncUrl) urlState.setScorer(nextId, slug)
      else {
        setLocalScorerId(nextId)
        setLocalGoalId(undefined)
      }
    },
    [syncUrl, urlState],
  )

  const clearFilters = useCallback(() => {
    if (syncUrl) urlState.clearFilters()
    else {
      setLocalCompetitionId(fixedCompetitionId ?? ALL_FILTER)
      setLocalScorerId(ALL_FILTER)
      setLocalGoalId(undefined)
    }
  }, [syncUrl, urlState, fixedCompetitionId])

  const openGoal = useCallback(
    (goal: GoalVideo) => {
      if (syncUrl) urlState.openGoal(goal)
      else setLocalGoalId(goal.id)
    },
    [syncUrl, urlState],
  )

  const closeGoal = useCallback(() => {
    if (syncUrl) urlState.closeGoal()
    else setLocalGoalId(undefined)
  }, [syncUrl, urlState])

  const setDensity = useCallback(
    (next: GoalDensity) => {
      setStoredDensity(next)
      try {
        window.localStorage.setItem(DENSITY_STORAGE_KEY, next)
      } catch {
        // Preference is session-only when storage is unavailable.
      }
      if (syncUrl) urlState.setDensity(next)
    },
    [syncUrl, urlState],
  )

  const openGoalVideo = useMemo(
    () => filteredGoals.find((goal) => goal.id === goalId),
    [filteredGoals, goalId],
  )

  return {
    format,
    competitionId,
    scorerId,
    density,
    formatGoals,
    filteredGoals,
    competitionOptions,
    competitionScopeTotal: competitionScope.length,
    scorerOptions,
    scorerScopeTotal: scorerScope.length,
    openGoal: openGoalVideo,
    missingGoal: syncUrl ? urlState.missingGoal : false,
    setFormat,
    setCompetition,
    setScorer,
    clearFilters,
    openGoalById: openGoal,
    closeGoal,
    setDensity,
  }
}
