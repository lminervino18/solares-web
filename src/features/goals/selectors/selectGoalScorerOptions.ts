import type { GoalScorer, GoalVideo } from '../types/goals'

export type GoalScorerOption = {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly goals: number
  readonly scorer: GoalScorer
}

/**
 * Scorer filter options for the goals already narrowed to one format.
 *
 * Ordered by how many goal videos each scorer has, then alphabetically, so the
 * players with the most footage are reachable without scrolling.
 */
export function selectGoalScorerOptions(goals: readonly GoalVideo[]): readonly GoalScorerOption[] {
  const byId = new Map<string, { scorer: GoalScorer; goals: number }>()

  for (const goal of goals) {
    const current = byId.get(goal.scorer.id)
    if (current === undefined) byId.set(goal.scorer.id, { scorer: goal.scorer, goals: 1 })
    else current.goals += 1
  }

  return [...byId.values()]
    .sort((a, b) => b.goals - a.goals || a.scorer.name.localeCompare(b.scorer.name, 'es-AR'))
    .map(({ scorer, goals: count }) => ({
      id: scorer.id,
      slug: scorer.slug,
      name: scorer.name,
      goals: count,
      scorer,
    }))
}
