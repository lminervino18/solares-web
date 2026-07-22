import { useState } from 'react'

import { Button } from '@/components/primitives/Button/Button'
import type { Scorer } from '../types/championships'

export type ScorersTableProps = {
  scorers: readonly Scorer[]
}

const INITIAL_COUNT = 5

/**
 * Shows the championship top scorers, initially the top five, with an
 * accessible control to reveal the full list.
 */
export function ScorersTable({ scorers }: ScorersTableProps) {
  const [expanded, setExpanded] = useState(false)

  if (scorers.length === 0) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-muted">
        Todavía no hay goleadores registrados.
      </p>
    )
  }

  const visible = expanded ? scorers : scorers.slice(0, INITIAL_COUNT)
  const canExpand = scorers.length > INITIAL_COUNT

  return (
    <div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th
              scope="col"
              className="w-10 py-2 text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
            >
              #
            </th>
            <th
              scope="col"
              className="py-2 text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
            >
              Jugador
            </th>
            <th
              scope="col"
              className="py-2 text-right text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
            >
              Goles
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((scorer, index) => (
            <tr key={scorer.id} className="border-b border-line/60">
              <td className="py-2 text-[length:var(--font-size-sm)] text-muted tabular-nums">
                {index + 1}
              </td>
              <td className="py-2 text-[length:var(--font-size-sm)] text-primary">
                {scorer.playerName}
              </td>
              <td className="py-2 text-right text-[length:var(--font-size-sm)] font-semibold text-primary tabular-nums">
                {scorer.goals}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {canExpand && (
        <Button
          type="button"
          tone="neutral"
          variant="text"
          size="sm"
          className="mt-3"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Mostrar menos' : 'Ver todos los goleadores'}
        </Button>
      )}
    </div>
  )
}
