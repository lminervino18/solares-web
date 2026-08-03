import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { GoalFormat, GoalVideo } from '../types/goals'
import { ALL_FILTER } from '../selectors/selectFilteredGoals'
import {
  COMPETITION_PARAM,
  DEFAULT_GOAL_FORMAT,
  DENSITY_PARAM,
  FORMAT_PARAM,
  GOAL_PARAM,
  SCORER_PARAM,
} from '../utils/buildGoalShareUrl'
import {
  parseGoalUrlState,
  type GoalDensity,
  type ResolvedGoalUrlState,
} from '../utils/parseGoalUrlState'

export type GoalUrlState = ResolvedGoalUrlState & {
  readonly setFormat: (format: GoalFormat) => void
  readonly setCompetition: (competitionId: string, slug?: string) => void
  readonly setScorer: (scorerId: string, slug?: string) => void
  readonly clearFilters: () => void
  readonly openGoal: (goal: GoalVideo) => void
  readonly closeGoal: () => void
  readonly setDensity: (density: GoalDensity) => void
}

export function useGoalUrlState(
  goals: readonly GoalVideo[],
  options?: { enabled?: boolean },
): GoalUrlState {
  const enabled = options?.enabled ?? true
  const [searchParams, setSearchParams] = useSearchParams()

  const resolved = useMemo(
    () => parseGoalUrlState(goals, enabled ? searchParams : new URLSearchParams()),
    [goals, searchParams, enabled],
  )

  const pendingWrite = useRef<string | undefined>(undefined)

  useEffect(() => {
    pendingWrite.current = undefined
  }, [searchParams])

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void, writeOptions?: { replace?: boolean }) => {
      if (!enabled) return

      const params = new URLSearchParams(searchParams)
      mutate(params)
      const next = params.toString()

      if (next === searchParams.toString() || next === pendingWrite.current) return

      pendingWrite.current = next

      setSearchParams(params, {
        replace: writeOptions?.replace ?? false,
        preventScrollReset: true,
      })
    },
    [searchParams, setSearchParams, enabled],
  )

  useEffect(() => {
    if (!enabled || !resolved.needsCleanup) return
    update(
      (params) => {
        if (resolved.competitionId === ALL_FILTER) params.delete(COMPETITION_PARAM)
        if (resolved.scorerId === ALL_FILTER) params.delete(SCORER_PARAM)
        if (resolved.format === DEFAULT_GOAL_FORMAT) params.delete(FORMAT_PARAM)
        else params.set(FORMAT_PARAM, resolved.format)
      },
      { replace: true },
    )
  }, [enabled, resolved, update])

  const setFormat = useCallback(
    (format: GoalFormat) => {
      update((params) => {
        params.delete(COMPETITION_PARAM)
        params.delete(SCORER_PARAM)
        params.delete(GOAL_PARAM)
        if (format === DEFAULT_GOAL_FORMAT) params.delete(FORMAT_PARAM)
        else params.set(FORMAT_PARAM, format)
      })
    },
    [update],
  )

  const setCompetition = useCallback(
    (competitionId: string, slug?: string) => {
      update((params) => {
        if (competitionId === ALL_FILTER || slug === undefined) params.delete(COMPETITION_PARAM)
        else params.set(COMPETITION_PARAM, slug)
        params.delete(GOAL_PARAM)
      })
    },
    [update],
  )

  const setScorer = useCallback(
    (scorerId: string, slug?: string) => {
      update((params) => {
        if (scorerId === ALL_FILTER || slug === undefined) params.delete(SCORER_PARAM)
        else params.set(SCORER_PARAM, slug)
        params.delete(GOAL_PARAM)
      })
    },
    [update],
  )

  const clearFilters = useCallback(() => {
    update((params) => {
      params.delete(COMPETITION_PARAM)
      params.delete(SCORER_PARAM)
      params.delete(GOAL_PARAM)
    })
  }, [update])

  const openGoal = useCallback(
    (goal: GoalVideo) => {
      update((params) => {
        params.set(GOAL_PARAM, goal.id)
      })
    },
    [update],
  )

  const closeGoal = useCallback(() => {
    update((params) => {
      params.delete(GOAL_PARAM)
    })
  }, [update])

  const setDensity = useCallback(
    (density: GoalDensity) => {
      update(
        (params) => {
          params.set(DENSITY_PARAM, density)
        },
        { replace: true },
      )
    },
    [update],
  )

  return {
    ...resolved,
    setFormat,
    setCompetition,
    setScorer,
    clearFilters,
    openGoal,
    closeGoal,
    setDensity,
  }
}
