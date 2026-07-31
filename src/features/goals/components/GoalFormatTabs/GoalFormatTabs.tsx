import type { ReactNode } from 'react'
import { Tabs } from 'radix-ui'

import { cn } from '@/lib/cn'
import { GOAL_FORMATS, GOAL_FORMAT_LABEL, GOAL_FORMAT_LONG_LABEL } from '../../types/goals'
import type { GoalFormat } from '../../types/goals'

export type GoalFormatTabsProps = {
  format: GoalFormat
  onFormatChange: (format: GoalFormat) => void
  renderPanel: (format: GoalFormat) => ReactNode
}

const TRIGGER = cn(
  'relative min-w-20 rounded-(--radius-md) px-5 py-2 text-[length:var(--font-size-sm)] font-bold',
  'text-secondary transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
  'data-[state=active]:bg-brand data-[state=active]:text-on-brand',
  'data-[state=inactive]:hover:text-primary',
)

function isGoalFormat(value: string): value is GoalFormat {
  return (GOAL_FORMATS as readonly string[]).includes(value)
}

/**
 * F8/F5 switcher for the goals gallery. F8 is the default and only the active
 * panel mounts, so the other format's posters are never requested.
 */
export function GoalFormatTabs({ format, onFormatChange, renderPanel }: GoalFormatTabsProps) {
  return (
    <Tabs.Root
      value={format}
      onValueChange={(value) => {
        if (isGoalFormat(value)) onFormatChange(value)
      }}
    >
      <Tabs.List
        aria-label="Modalidades de goles"
        className="inline-flex gap-1 rounded-(--radius-lg) border border-line bg-surface-elevated p-1"
      >
        {GOAL_FORMATS.map((value) => (
          <Tabs.Trigger key={value} value={value} className={TRIGGER}>
            {GOAL_FORMAT_LABEL[value]}
            <span className="sr-only"> — Goles de {GOAL_FORMAT_LONG_LABEL[value]}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {GOAL_FORMATS.map((value) => (
        <Tabs.Content key={value} value={value} className="mt-8 focus-visible:outline-none">
          {renderPanel(value)}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
