import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/cn'
import { Button } from '@/components/primitives/Button/Button'
import { Text } from '@/components/primitives/Text/Text'
import type { GoalVideo } from '../../types/goals'
import type { GoalDensity } from '../../utils/parseGoalUrlState'
import { GoalCard } from '../GoalCard/GoalCard'

export type GoalGridProps = {
  goals: readonly GoalVideo[]
  visibleCount: number
  density: GoalDensity
  onOpen: (goal: GoalVideo) => void
  onShowMore: () => void
  showFormat?: boolean
}

const DENSITY_COLUMNS: Record<GoalDensity, string> = {
  large: 'grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
  medium: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  compact: 'grid-cols-2 min-[560px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
}

export function GoalGrid({
  goals,
  visibleCount,
  density,
  onOpen,
  onShowMore,
  showFormat = false,
}: GoalGridProps) {
  const reducedMotion = useReducedMotion()
  const visible = goals.slice(0, visibleCount)
  const remaining = goals.length - visible.length

  return (
    <div>
      <ul className={cn('grid list-none gap-4', DENSITY_COLUMNS[density])}>
        {visible.map((goal, index) => (
          <motion.li
            key={goal.id}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: reducedMotion ? 0 : Math.min(index, 8) * 0.02 }}
          >
            <GoalCard goal={goal} onOpen={onOpen} showFormat={showFormat} />
          </motion.li>
        ))}
      </ul>

      {remaining > 0 && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <Button type="button" variant="outline" tone="brand" onClick={onShowMore}>
            Mostrar más goles
          </Button>
          <Text size="sm" tone="muted">
            {visible.length} de {goals.length}
          </Text>
        </div>
      )}
    </div>
  )
}
