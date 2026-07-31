import type { GoalVideo } from '../types/goals'

export type AdjacentGoals = {
  readonly index: number
  readonly total: number
  readonly previous?: GoalVideo
  readonly next?: GoalVideo
}

/**
 * Locates a goal inside the currently filtered collection and resolves its
 * neighbours.
 *
 * Navigation never leaves the filtered set, and the ends are closed rather than
 * circular so the player's position stays unambiguous: at the first goal there
 * is no previous, at the last there is no next.
 */
export function selectAdjacentGoals(
  goals: readonly GoalVideo[],
  goalId: string | undefined,
): AdjacentGoals {
  if (goalId === undefined) return { index: -1, total: goals.length }

  const index = goals.findIndex((goal) => goal.id === goalId)
  if (index === -1) return { index: -1, total: goals.length }

  const previous = index > 0 ? goals[index - 1] : undefined
  const next = index < goals.length - 1 ? goals[index + 1] : undefined

  return {
    index,
    total: goals.length,
    ...(previous === undefined ? {} : { previous }),
    ...(next === undefined ? {} : { next }),
  }
}
