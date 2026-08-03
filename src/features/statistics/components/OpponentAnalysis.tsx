import { useState } from 'react'

import { Heading } from '@/components/primitives/Heading/Heading'
import { Button } from '@/components/primitives/Button/Button'
import { formatMatchDate } from '@/features/championships/utils/championshipLabels'
import type { OpponentStatistics } from '../types/statistics'
import { formatSignedDifference } from '../utils/formatNumber'

export type OpponentAnalysisProps = {
  opponents: readonly OpponentStatistics[]
  scopeLabel: string
}

const TOP_COUNT = 5

export function OpponentAnalysis({ opponents, scopeLabel }: OpponentAnalysisProps) {
  const [expanded, setExpanded] = useState(false)

  if (opponents.length === 0) {
    return (
      <section aria-label={`Rivales de ${scopeLabel}`}>
        <Heading as="h2" size="xl" className="mb-4">
          Rivales frecuentes
        </Heading>
        <p className="text-[length:var(--font-size-sm)] text-muted">
          Todavía no hay rivales registrados.
        </p>
      </section>
    )
  }

  const top = opponents[0]
  const rows = expanded ? opponents : opponents.slice(0, TOP_COUNT)

  return (
    <section aria-label={`Rivales de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-4">
        Rivales frecuentes
      </Heading>

      {top && (
        <div className="mb-4 rounded-(--radius-xl) border border-line bg-surface-elevated p-5">
          <p className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-brand uppercase">
            El rival más enfrentado
          </p>
          <p className="mt-1 text-[length:var(--font-size-display-sm)] font-bold text-primary">
            {top.opponentName}
          </p>
          <p className="mt-2 text-[length:var(--font-size-sm)] text-secondary">
            {top.played} partidos · {top.won}G {top.drawn}E {top.lost}P · {top.goalsFor}-
            {top.goalsAgainst} ({formatSignedDifference(top.goalDifference)})
            {top.lastDate ? ` · último: ${formatMatchDate(top.lastDate)}` : ''}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="px-2 py-2 text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
              >
                Rival
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-right text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
              >
                PJ
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-right text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
              >
                G-E-P
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-right text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
              >
                DG
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((opponent) => (
              <tr key={opponent.opponentId} className="border-b border-line/60">
                <td className="px-2 py-2 text-[length:var(--font-size-sm)] text-primary">
                  {opponent.opponentName}
                </td>
                <td className="px-2 py-2 text-right text-[length:var(--font-size-sm)] text-secondary tabular-nums">
                  {opponent.played}
                </td>
                <td className="px-2 py-2 text-right text-[length:var(--font-size-sm)] text-secondary tabular-nums">
                  {opponent.won}-{opponent.drawn}-{opponent.lost}
                </td>
                <td className="px-2 py-2 text-right text-[length:var(--font-size-sm)] font-semibold text-primary tabular-nums">
                  {formatSignedDifference(opponent.goalDifference)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {opponents.length > TOP_COUNT && (
        <Button
          type="button"
          tone="neutral"
          variant="text"
          size="sm"
          className="mt-3"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Mostrar menos' : 'Ver todos los rivales'}
        </Button>
      )}
    </section>
  )
}
