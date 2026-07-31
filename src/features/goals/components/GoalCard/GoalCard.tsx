import { useState } from 'react'
import { CirclePlay, Video } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Text } from '@/components/primitives/Text/Text'
import type { GoalVideo } from '../../types/goals'
import { GOAL_FORMAT_LABEL } from '../../types/goals'
import { formatGoalDuration } from '../../utils/formatGoalDuration'

export type GoalCardProps = {
  goal: GoalVideo
  onOpen: (goal: GoalVideo) => void
  showFormat?: boolean
}

/**
 * A single goal in the grid.
 *
 * Renders a static poster only: no video element is mounted and nothing plays
 * on hover, so a long grid stays cheap. The whole card is one button with an
 * accessible name describing the goal it opens.
 */
export function GoalCard({ goal, onOpen, showFormat = false }: GoalCardProps) {
  const [posterFailed, setPosterFailed] = useState(false)
  const duration = formatGoalDuration(goal.media.duration)
  const label = `Abrir gol de ${goal.scorer.name} en ${goal.competition.name}`

  return (
    <button
      type="button"
      onClick={() => onOpen(goal)}
      aria-label={label}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-(--radius-lg)',
        'border border-line bg-surface text-left transition-colors',
        'hover:border-(--color-border-strong)',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
      )}
    >
      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-surface-elevated">
        {posterFailed ? (
          <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
            <Video aria-hidden className="size-8" />
            <span className="text-[length:var(--font-size-xs)]">Miniatura no disponible</span>
          </span>
        ) : (
          <img
            src={goal.cloudinary.posterUrl}
            alt=""
            width={640}
            height={480}
            loading="lazy"
            decoding="async"
            onError={() => setPosterFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent"
        />

        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          <CirclePlay className="size-12 text-white drop-shadow" />
        </span>

        {duration !== undefined && (
          <span className="absolute right-2 bottom-2 rounded-(--radius-sm) bg-black/70 px-1.5 py-0.5 text-[length:var(--font-size-xs)] font-semibold text-white">
            {duration}
          </span>
        )}

        {showFormat && (
          <span className="absolute top-2 left-2 rounded-(--radius-pill) bg-brand px-2 py-0.5 text-[length:var(--font-size-xs)] font-bold text-on-brand">
            {GOAL_FORMAT_LABEL[goal.format]}
          </span>
        )}
      </span>

      <span className="flex flex-col gap-0.5 p-3">
        <Text as="span" size="sm" weight="bold" tone="primary" className="truncate">
          {goal.scorer.name}
        </Text>
        <Text as="span" size="xs" tone="muted" className="truncate">
          {goal.competition.name}
        </Text>
      </span>
    </button>
  )
}
