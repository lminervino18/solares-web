import { Check, ChevronDown } from 'lucide-react'
import { Select } from 'radix-ui'

import { cn } from '@/lib/cn'
import { ALL_FILTER } from '../../selectors/selectFilteredGoals'
import type { GoalCompetitionOption } from '../../selectors/selectGoalCompetitionOptions'

export type GoalCompetitionFilterProps = {
  options: readonly GoalCompetitionOption[]
  value: string
  totalGoals: number
  onChange: (competitionId: string, slug?: string) => void
}

const TRIGGER = cn(
  'inline-flex h-10 w-full items-center justify-between gap-2 rounded-(--radius-md)',
  'border border-line bg-surface px-3 text-[length:var(--font-size-sm)] text-primary',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
)

const ITEM = cn(
  'relative flex cursor-pointer items-center justify-between gap-3 rounded-(--radius-sm) py-2 pr-8 pl-3',
  'text-[length:var(--font-size-sm)] text-primary outline-none select-none',
  'data-[highlighted]:bg-surface-elevated data-[state=checked]:font-semibold',
)

/**
 * Tournament filter. Friendlies and preseason are listed alongside official
 * competitions because they are real sources of goals, and each option shows
 * how many goals it holds inside the active format.
 */
export function GoalCompetitionFilter({
  options,
  value,
  totalGoals,
  onChange,
}: GoalCompetitionFilterProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-secondary uppercase">
        Torneo
      </span>
      <Select.Root
        value={value}
        onValueChange={(next) => {
          const option = options.find((item) => item.id === next)
          onChange(next, option?.competition.slug)
        }}
      >
        <Select.Trigger className={TRIGGER} aria-label="Filtrar por torneo">
          <Select.Value />
          <Select.Icon>
            <ChevronDown aria-hidden className="size-4 text-secondary" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="z-[var(--z-toast)] max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-(--radius-md) border border-line bg-surface shadow-lg"
          >
            <Select.Viewport className="p-1">
              <Select.Item value={ALL_FILTER} className={ITEM}>
                <Select.ItemText>Todos</Select.ItemText>
                <span className="text-[length:var(--font-size-xs)] text-muted">{totalGoals}</span>
                <Select.ItemIndicator className="absolute right-2">
                  <Check aria-hidden className="size-4 text-brand" />
                </Select.ItemIndicator>
              </Select.Item>

              {options.map((option) => (
                <Select.Item key={option.id} value={option.id} className={ITEM}>
                  <Select.ItemText>{option.name}</Select.ItemText>
                  <span className="text-[length:var(--font-size-xs)] text-muted">
                    {option.goals}
                  </span>
                  <Select.ItemIndicator className="absolute right-2">
                    <Check aria-hidden className="size-4 text-brand" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
