import { Heading } from '@/components/primitives/Heading/Heading'
import type { StreakRecord, StreakType } from '../types/statistics'
import { formatMatchDate } from '@/features/championships/utils/championshipLabels'

export type StreakRecordsProps = {
  streaks: readonly StreakRecord[]
  scopeLabel: string
}

const STREAK_LABEL: Record<StreakType, string> = {
  wins: 'Racha de victorias',
  unbeaten: 'Invicto más largo',
  losses: 'Racha de derrotas',
  winless: 'Racha sin ganar',
  scoring: 'Convirtiendo goles',
  'clean-sheets': 'Con el arco en cero',
}

function context(streak: StreakRecord): string {
  const start = formatMatchDate(streak.startDate)
  const end = formatMatchDate(streak.endDate)
  const dates = start && end ? `${start} → ${end}` : undefined
  const rivals =
    streak.firstOpponent === streak.lastOpponent
      ? `vs ${streak.firstOpponent}`
      : `${streak.firstOpponent} → ${streak.lastOpponent}`
  return [dates, rivals].filter(Boolean).join(' · ')
}

/**
 * Longest historical streaks for a format, each shown with its length and
 * context (dates and opponents) rather than a bare number.
 */
export function StreakRecords({ streaks, scopeLabel }: StreakRecordsProps) {
  if (streaks.length === 0) {
    return (
      <section aria-label={`Rachas de ${scopeLabel}`}>
        <Heading as="h2" size="xl" className="mb-4">
          Rachas
        </Heading>
        <p className="text-[length:var(--font-size-sm)] text-muted">
          Todavía no hay partidos suficientes para calcular rachas.
        </p>
      </section>
    )
  }

  return (
    <section aria-label={`Rachas de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-4">
        Rachas
      </Heading>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {streaks.map((streak) => (
          <li key={streak.type} className="rounded-(--radius-lg) border border-line bg-surface p-4">
            <p className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase">
              {STREAK_LABEL[streak.type]}
            </p>
            <p className="mt-1 text-[length:var(--font-size-display-sm)] leading-none font-bold text-brand tabular-nums">
              {streak.length}
            </p>
            <p className="mt-1 text-[length:var(--font-size-xs)] text-secondary">
              {streak.length === 1 ? 'partido' : 'partidos'}
            </p>
            <p className="mt-2 text-[length:var(--font-size-xs)] text-muted">{context(streak)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
