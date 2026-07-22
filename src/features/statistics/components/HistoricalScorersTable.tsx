import { useId, useMemo, useState } from 'react'

import { cn } from '@/lib/cn'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Button } from '@/components/primitives/Button/Button'
import type { HistoricalScorer } from '../types/statistics'
import { formatInteger } from '../utils/formatNumber'

export type HistoricalScorersTableProps = {
  scorers: readonly HistoricalScorer[]
  scopeLabel: string
}

const TOP_COUNT = 10

const MEDAL_CLASS: Record<number, string> = {
  1: 'bg-[color-mix(in_oklab,var(--color-medal-gold)_28%,transparent)] text-medal-gold-highlight',
  2: 'bg-[color-mix(in_oklab,var(--color-medal-silver)_28%,transparent)] text-medal-silver-highlight',
  3: 'bg-[color-mix(in_oklab,var(--color-medal-bronze)_28%,transparent)] text-medal-bronze-highlight',
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-full text-[length:var(--font-size-sm)] font-bold tabular-nums',
        MEDAL_CLASS[rank] ?? 'text-muted',
      )}
    >
      {rank}
    </span>
  )
}

/**
 * Historical scorers table: the top ten by default, expandable to the full,
 * searchable list in a scroll container with a sticky header. Top three ranks
 * carry gold/silver/bronze accents, but the rank number always conveys position.
 */
export function HistoricalScorersTable({ scorers, scopeLabel }: HistoricalScorersTableProps) {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const searchId = useId()

  const filtered = useMemo(() => {
    if (!expanded) return scorers.slice(0, TOP_COUNT)
    const needle = normalize(query.trim())
    if (needle.length === 0) return scorers
    return scorers.filter((scorer) => normalize(scorer.playerName).includes(needle))
  }, [expanded, query, scorers])

  if (scorers.length === 0) {
    return (
      <section aria-label={`Goleadores históricos de ${scopeLabel}`}>
        <Heading as="h2" size="xl" className="mb-4">
          Goleadores históricos
        </Heading>
        <p className="text-[length:var(--font-size-sm)] text-muted">
          Todavía no hay goleadores registrados.
        </p>
      </section>
    )
  }

  return (
    <section aria-label={`Goleadores históricos de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-1">
        Goleadores históricos
      </Heading>
      <p className="mb-4 text-[length:var(--font-size-sm)] text-muted">
        {formatInteger(scorers.length)} goleadores registrados en {scopeLabel}.
      </p>

      {expanded && (
        <div className="mb-3">
          <label
            htmlFor={searchId}
            className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-secondary"
          >
            Buscar jugador
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre del jugador"
            className="w-full max-w-sm rounded-(--radius-md) border border-line bg-surface px-3 py-2 text-[length:var(--font-size-sm)] text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)"
          />
        </div>
      )}

      <div
        className={cn(
          expanded && 'max-h-[28rem] overflow-y-auto rounded-(--radius-lg) border border-line',
        )}
      >
        <table className="w-full border-collapse text-left">
          <thead className={cn(expanded && 'sticky top-0 z-10 bg-surface-elevated')}>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="w-14 px-3 py-2 text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
              >
                #
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
              >
                Jugador
              </th>
              <th
                scope="col"
                className="px-3 py-2 text-right text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
              >
                Goles
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scorer) => (
              <tr key={scorer.playerId} className="border-b border-line/60">
                <td className="px-3 py-2">
                  <RankBadge rank={scorer.rank} />
                </td>
                <td className="px-3 py-2">
                  <span className="text-[length:var(--font-size-sm)] text-primary">
                    {scorer.playerName}
                  </span>
                  <span className="block text-[length:var(--font-size-xs)] text-muted">
                    en {formatInteger(scorer.tournamentsWithGoals)}{' '}
                    {scorer.tournamentsWithGoals === 1 ? 'torneo' : 'torneos'}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-[length:var(--font-size-md)] font-bold text-primary tabular-nums">
                  {formatInteger(scorer.goals)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expanded && filtered.length === 0 && (
          <p className="px-3 py-4 text-[length:var(--font-size-sm)] text-muted">
            No se encontraron jugadores con ese nombre.
          </p>
        )}
      </div>

      {scorers.length > TOP_COUNT && (
        <Button
          type="button"
          tone="neutral"
          variant="text"
          size="sm"
          className="mt-3"
          aria-expanded={expanded}
          onClick={() => {
            setExpanded((value) => !value)
            setQuery('')
          }}
        >
          {expanded ? 'Mostrar solo el top 10' : 'Ver tabla completa'}
        </Button>
      )}
    </section>
  )
}
