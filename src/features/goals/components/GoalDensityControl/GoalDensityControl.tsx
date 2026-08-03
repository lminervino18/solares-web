import { Grid2x2, Grid3x3, LayoutGrid } from 'lucide-react'
import { ToggleGroup } from 'radix-ui'

import { cn } from '@/lib/cn'
import { GOAL_DENSITIES, type GoalDensity } from '../../utils/parseGoalUrlState'

export type GoalDensityControlProps = {
  value: GoalDensity
  onChange: (density: GoalDensity) => void
}

const DENSITY_LABEL: Record<GoalDensity, string> = {
  large: 'Grande',
  medium: 'Mediana',
  compact: 'Compacta',
}

const DENSITY_ICON: Record<GoalDensity, typeof LayoutGrid> = {
  large: LayoutGrid,
  medium: Grid2x2,
  compact: Grid3x3,
}

const ITEM = cn(
  'inline-flex h-9 items-center gap-1.5 rounded-(--radius-sm) px-2.5',
  'text-[length:var(--font-size-xs)] font-semibold text-secondary transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
  'data-[state=on]:bg-brand data-[state=on]:text-on-brand',
  'data-[state=off]:hover:text-primary',
)

export function GoalDensityControl({ value, onChange }: GoalDensityControlProps) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next !== '') onChange(next as GoalDensity)
      }}
      aria-label="Densidad de la grilla"
      className="inline-flex gap-1 rounded-(--radius-md) border border-line bg-surface-elevated p-1"
    >
      {GOAL_DENSITIES.map((density) => {
        const Icon = DENSITY_ICON[density]
        return (
          <ToggleGroup.Item key={density} value={density} className={ITEM}>
            <Icon aria-hidden className="size-4" />
            <span className="hidden sm:inline">{DENSITY_LABEL[density]}</span>
            <span className="sr-only sm:hidden">{DENSITY_LABEL[density]}</span>
          </ToggleGroup.Item>
        )
      })}
    </ToggleGroup.Root>
  )
}
