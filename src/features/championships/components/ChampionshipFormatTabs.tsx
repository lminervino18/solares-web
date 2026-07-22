import type { ReactNode } from 'react'
import { Tabs } from 'radix-ui'

import { cn } from '@/lib/cn'
import { isFootballFormat, type FootballFormat } from '@/config/championships-source.config'

export type ChampionshipFormatTabsProps = {
  format: FootballFormat
  onFormatChange: (format: FootballFormat) => void
  renderPanel: (format: FootballFormat) => ReactNode
}

const TRIGGER = cn(
  'relative min-w-20 rounded-(--radius-md) px-5 py-2 text-[length:var(--font-size-sm)] font-bold',
  'text-secondary transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
  'data-[state=active]:bg-brand data-[state=active]:text-on-brand',
  'data-[state=inactive]:hover:text-primary',
)

const TABS: readonly { value: FootballFormat; label: string; hint: string }[] = [
  { value: 'f8', label: 'F8', hint: 'Campeonatos de fútbol 8' },
  { value: 'f5', label: 'F5', hint: 'Campeonatos de fútbol 5' },
]

/**
 * Accessible F8/F5 format switcher built on Radix Tabs. F8 is the default. Only
 * the active panel mounts, so the inactive format's media is not loaded.
 */
export function ChampionshipFormatTabs({
  format,
  onFormatChange,
  renderPanel,
}: ChampionshipFormatTabsProps) {
  return (
    <Tabs.Root
      value={format}
      onValueChange={(value) => {
        if (isFootballFormat(value)) onFormatChange(value)
      }}
    >
      <Tabs.List
        aria-label="Modalidades de campeonatos"
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
