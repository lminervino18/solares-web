import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type StatTileProps = {
  label: string
  value: ReactNode
  hint?: string
  emphasis?: boolean
  className?: string
}

/**
 * A single statistic presented as label + prominent value, with an optional
 * hint. `emphasis` renders a larger, brand-accented protagonist tile.
 */
export function StatTile({ label, value, hint, emphasis = false, className }: StatTileProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-1 rounded-(--radius-lg) border border-line p-4',
        emphasis ? 'bg-surface-elevated' : 'bg-surface',
        className,
      )}
    >
      <p className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase">
        {label}
      </p>
      <p
        className={cn(
          'font-display font-bold text-primary tabular-nums',
          emphasis
            ? 'text-[length:var(--font-size-display-sm)] leading-none text-brand'
            : 'text-[length:var(--font-size-xl)]',
        )}
      >
        {value}
      </p>
      {hint && <p className="text-[length:var(--font-size-xs)] text-muted">{hint}</p>}
    </div>
  )
}
