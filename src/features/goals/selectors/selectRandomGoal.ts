import type { GoalVideo } from '../types/goals'

/**
 * Picks a goal uniformly from the filtered collection.
 *
 * The currently open goal is excluded whenever another one is available, so the
 * button always visibly does something. With a single result that goal is
 * returned, and with none the caller gets `undefined` and disables the control.
 *
 * `random` is injected so the choice can be asserted in tests.
 */
export function selectRandomGoal(
  goals: readonly GoalVideo[],
  currentGoalId?: string,
  random: () => number = Math.random,
): GoalVideo | undefined {
  if (goals.length === 0) return undefined

  const candidates =
    goals.length > 1 && currentGoalId !== undefined
      ? goals.filter((goal) => goal.id !== currentGoalId)
      : goals

  const pool = candidates.length > 0 ? candidates : goals
  const index = Math.min(Math.floor(random() * pool.length), pool.length - 1)
  return pool[index]
}
