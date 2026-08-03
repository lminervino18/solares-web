import { Heading } from '@/components/primitives/Heading/Heading'
import type { HistoricalScorer } from '../types/statistics'
import { formatInteger } from '../utils/formatNumber'

export type KnockoutScorersProps = {
  scorers: readonly HistoricalScorer[]
  scopeLabel: string
}

const TOP_COUNT = 5

export function KnockoutScorers({ scorers, scopeLabel }: KnockoutScorersProps) {
  const top = scorers.slice(0, TOP_COUNT)

  return (
    <section aria-label={`Goleadores en fases eliminatorias de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-4">
        Goleadores en fases eliminatorias
      </Heading>
      {top.length === 0 ? (
        <p className="text-[length:var(--font-size-sm)] text-muted">
          Todavía no hay goles registrados en fases eliminatorias.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {top.map((scorer, index) => (
            <li
              key={scorer.playerId}
              className="flex items-center justify-between gap-3 rounded-(--radius-md) border border-line bg-surface px-3 py-2.5"
            >
              <span className="flex items-center gap-3">
                <span className="w-6 text-[length:var(--font-size-sm)] font-bold text-muted tabular-nums">
                  {index + 1}
                </span>
                <span className="text-[length:var(--font-size-sm)] text-primary">
                  {scorer.playerName}
                </span>
              </span>
              <span className="text-[length:var(--font-size-md)] font-bold text-primary tabular-nums">
                {formatInteger(scorer.knockoutGoals)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
