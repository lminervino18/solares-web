import type { GoalCompetition, GoalVideo } from '../types/goals'
import { compareGoalCompetitions } from '../utils/compareGoalCompetitions'

export type GoalCompetitionOption = {
  readonly id: string
  readonly name: string
  readonly goals: number
  readonly competition: GoalCompetition
}

/**
 * Tournament filter options for the goals already narrowed to one format.
 *
 * Only competitions that actually have goals are listed, so the filter can
 * never produce an empty result. Official competitions come first (most recent
 * first), then friendlies and preseason.
 */
export function selectGoalCompetitionOptions(
  goals: readonly GoalVideo[],
): readonly GoalCompetitionOption[] {
  const byId = new Map<string, { competition: GoalCompetition; goals: number }>()

  for (const goal of goals) {
    const current = byId.get(goal.competition.id)
    if (current === undefined)
      byId.set(goal.competition.id, { competition: goal.competition, goals: 1 })
    else current.goals += 1
  }

  return [...byId.values()]
    .sort((a, b) => compareGoalCompetitions(a.competition, b.competition))
    .map(({ competition, goals: count }) => ({
      id: competition.id,
      name: competition.name,
      goals: count,
      competition,
    }))
}
