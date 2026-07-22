import type { ReactNode } from 'react'
import { Tabs } from 'radix-ui'

import { cn } from '@/lib/cn'
import { isFootballFormat } from '@/config/championships-source.config'
import type { StatisticsScope } from '../types/statistics'

export type StatisticsScopeTabsProps = {
  scope: StatisticsScope
  onScopeChange: (scope: StatisticsScope) => void
  renderPanel: (scope: StatisticsScope) => ReactNode
}

const TRIGGER = cn(
  'min-w-20 rounded-(--radius-md) px-5 py-2 text-[length:var(--font-size-sm)] font-bold',
  'text-secondary transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
  'data-[state=active]:bg-brand data-[state=active]:text-on-brand',
  'data-[state=inactive]:hover:text-primary',
)

const TABS: readonly { value: StatisticsScope; label: string; hint: string }[] = [
  { value: 'f8', label: 'F8', hint: 'Estadísticas de fútbol 8' },
  { value: 'f5', label: 'F5', hint: 'Estadísticas de fútbol 5' },
]

/**
 * Accessible F8/F5 scope switcher for the Statistics page. F8 is the default.
 * The two formats are shown separately and never combined.
 */
export function StatisticsScopeTabs({
  scope,
  onScopeChange,
  renderPanel,
}: StatisticsScopeTabsProps) {
  return (
    <Tabs.Root
      value={scope}
      onValueChange={(value) => {
        if (isFootballFormat(value)) onScopeChange(value)
      }}
    >
      <Tabs.List
        aria-label="Modalidad de las estadísticas"
        className="inline-flex gap-1 rounded-(--radius-lg) border border-line bg-surface-elevated p-1"
      >
        {TABS.map((tab) => (
          <Tabs.Trigger key={tab.value} value={tab.value} className={TRIGGER}>
            {tab.label}
            <span className="sr-only"> — {tab.hint}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {TABS.map((tab) => (
        <Tabs.Content key={tab.value} value={tab.value} className="mt-8 focus-visible:outline-none">
          {renderPanel(tab.value)}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
