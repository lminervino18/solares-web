import type { GoalVideo } from '../types/goals'
import { goalVideoSchema, goalsManifestSchema } from '../schemas/goal-manifest.schema'
import { compareGoals } from '../utils/compareGoalCompetitions'
import manifest from './generated/goals.manifest.json'

function parseGoals(input: unknown): readonly GoalVideo[] {
  const parsed = goalsManifestSchema.safeParse(input)
  if (!parsed.success) {
    if (import.meta.env.DEV) console.warn('Invalid goals manifest. Rendering no goals.')
    return []
  }

  const valid: GoalVideo[] = []
  let invalid = 0
  for (const entry of parsed.data.goals) {
    const goal = goalVideoSchema.safeParse(entry)
    if (goal.success) valid.push(goal.data as GoalVideo)
    else invalid += 1
  }

  if (invalid > 0 && import.meta.env.DEV) {
    console.warn(`Dropped ${invalid} invalid goal entries from the manifest.`)
  }

  return [...valid].sort(compareGoals)
}

export const goals: readonly GoalVideo[] = parseGoals(manifest)
