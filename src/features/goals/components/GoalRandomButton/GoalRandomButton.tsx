import { Shuffle } from 'lucide-react'

import { Button } from '@/components/primitives/Button/Button'
import type { GoalVideo } from '../../types/goals'
import { selectRandomGoal } from '../../selectors/selectRandomGoal'

export type GoalRandomButtonProps = {
  goals: readonly GoalVideo[]
  currentGoalId?: string
  onPick: (goal: GoalVideo) => void
}

/**
 * Opens a random goal from the goals currently on screen, so the pick always
 * respects the active filters. With no results the button is disabled and says
 * why.
 */
export function GoalRandomButton({ goals, currentGoalId, onPick }: GoalRandomButtonProps) {
  const disabled = goals.length === 0

  return (
    <Button
      type="button"
      variant="soft"
      tone="brand"
      disabled={disabled}
      aria-describedby={disabled ? 'goal-random-hint' : undefined}
      leadingIcon={<Shuffle aria-hidden className="size-4" />}
      onClick={() => {
        const goal = selectRandomGoal(goals, currentGoalId)
        if (goal !== undefined) onPick(goal)
      }}
    >
      Ver un gol al azar
      {disabled && (
        <span id="goal-random-hint" className="sr-only">
          No hay goles disponibles con los filtros actuales.
        </span>
      )}
    </Button>
  )
}
