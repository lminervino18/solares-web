import type { GoalVideo } from '../types/goals'

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
