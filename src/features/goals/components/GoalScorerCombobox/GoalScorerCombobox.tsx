import { useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { Popover } from 'radix-ui'

import { cn } from '@/lib/cn'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ALL_FILTER } from '../../selectors/selectFilteredGoals'
import type { GoalScorerOption } from '../../selectors/selectGoalScorerOptions'
import { createScorerSearch } from '../../utils/normalizeGoalSearch'

export type GoalScorerComboboxProps = {
  options: readonly GoalScorerOption[]
  value: string
  totalGoals: number
  onChange: (scorerId: string, slug?: string) => void
}

type Entry = { id: string; slug?: string; name: string; goals: number }

const TRIGGER = cn(
  'inline-flex h-10 w-full items-center justify-between gap-2 rounded-(--radius-md)',
  'border border-line bg-surface px-3 text-[length:var(--font-size-sm)] text-primary',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
)

const OPTION = cn(
  'flex cursor-pointer items-center justify-between gap-3 rounded-(--radius-sm) px-3 py-2',
  'text-[length:var(--font-size-sm)] text-primary',
)

export function GoalScorerCombobox({
  options,
  value,
  totalGoals,
  onChange,
}: GoalScorerComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  // A pointing device can focus the search field for free. On touch, focusing it
  // opens the on-screen keyboard, which covers the list the user came to read —
  // so there the keyboard waits until the field itself is tapped.
  const hasFinePointer = useMediaQuery('(pointer: fine)')

  const search = useMemo(() => createScorerSearch(options), [options])

  const entries = useMemo<Entry[]>(() => {
    const matches = search(query)
    const all: Entry = { id: ALL_FILTER, name: 'Todos', goals: totalGoals }
    const mapped = matches.map((option) => ({
      id: option.id,
      slug: option.slug,
      name: option.name,
      goals: option.goals,
    }))
    return query.trim().length === 0 ? [all, ...mapped] : mapped
  }, [search, query, totalGoals])

  const selected = options.find((option) => option.id === value)
  const triggerLabel = selected === undefined ? 'Todos' : selected.name

  const commit = (entry: Entry) => {
    onChange(entry.id, entry.slug)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (entries.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % entries.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + entries.length) % entries.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const entry = entries[activeIndex]
      if (entry !== undefined) commit(entry)
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span
        id={`${listId}-label`}
        className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-secondary uppercase"
      >
        Goleador
      </span>

      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          // The query is cleared as the popover closes rather than in an
          // effect, so reopening always starts from the full list.
          if (!next) setQuery('')
        }}
      >
        <Popover.Trigger
          ref={triggerRef}
          className={TRIGGER}
          aria-labelledby={`${listId}-label`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-secondary" />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={6}
            align="start"
            onOpenAutoFocus={(event) => {
              event.preventDefault()
              if (hasFinePointer) inputRef.current?.focus()
            }}
            className="z-[var(--z-toast)] w-(--radix-popover-trigger-width) min-w-56 overflow-hidden rounded-(--radius-md) border border-line bg-surface shadow-lg"
          >
            <div className="sticky top-0 flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
              <Search aria-hidden className="size-4 shrink-0 text-muted" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-autocomplete="list"
                aria-label="Buscar goleador"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={onKeyDown}
                placeholder="Buscar goleador"
                className="w-full bg-transparent text-[length:var(--font-size-sm)] text-primary outline-none placeholder:text-muted"
              />
            </div>

            <ul id={listId} role="listbox" className="max-h-64 list-none overflow-y-auto p-1">
              {entries.length === 0 && (
                <li className="px-3 py-6 text-center text-[length:var(--font-size-sm)] text-muted">
                  No encontramos goleadores con ese nombre.
                </li>
              )}

              {entries.map((entry, index) => (
                <li key={entry.id} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={entry.id === value}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(entry)}
                    className={cn(
                      OPTION,
                      'w-full text-left',
                      index === activeIndex && 'bg-surface-elevated',
                      entry.id === value && 'font-semibold',
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {entry.id === value ? (
                        <Check aria-hidden className="size-4 shrink-0 text-brand" />
                      ) : (
                        <span aria-hidden className="size-4 shrink-0" />
                      )}
                      <span className="truncate">{entry.name}</span>
                    </span>
                    <span className="shrink-0 text-[length:var(--font-size-xs)] text-muted">
                      {entry.goals}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
