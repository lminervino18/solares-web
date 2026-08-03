import type { ReactNode } from 'react'
import { Tabs } from 'radix-ui'

import {
  FOOTBALL_FORMATS,
  FOOTBALL_FORMAT_LABEL,
  isFootballFormat,
  type FootballFormat,
} from '@/config/football-format'
import { cn } from '@/lib/cn'

export type FormatTabsProps = {
  format: FootballFormat
  onFormatChange: (format: FootballFormat) => void
  renderPanel: (format: FootballFormat) => ReactNode
  listLabel: string
  describeFormat: (format: FootballFormat) => string
}

const TRIGGER = cn(
  'relative min-w-20 rounded-(--radius-md) px-5 py-2 text-[length:var(--font-size-sm)] font-bold',
  'text-secondary transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
  'data-[state=active]:bg-brand data-[state=active]:text-on-brand',
  'data-[state=inactive]:hover:text-primary',
)

export function FormatTabs({
  format,
  onFormatChange,
  renderPanel,
  listLabel,
  describeFormat,
}: FormatTabsProps) {
  return (
    <Tabs.Root
      value={format}
      onValueChange={(value) => {
        if (isFootballFormat(value)) onFormatChange(value)
      }}
    >
      <Tabs.List
        aria-label={listLabel}
        className="inline-flex gap-1 rounded-(--radius-lg) border border-line bg-surface-elevated p-1"
      >
        {FOOTBALL_FORMATS.map((value) => (
          <Tabs.Trigger key={value} value={value} className={TRIGGER}>
            {FOOTBALL_FORMAT_LABEL[value]}
            <span className="sr-only"> — {describeFormat(value)}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {FOOTBALL_FORMATS.map((value) => (
        <Tabs.Content key={value} value={value} className="mt-8 focus-visible:outline-none">
          {renderPanel(value)}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
