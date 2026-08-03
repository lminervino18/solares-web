import { Link } from 'react-router-dom'

import { Heading } from '@/components/primitives/Heading/Heading'
import { formatMatchDate } from '@/features/championships/utils/championshipLabels'
import type { MatchRecord, MatchRecords as MatchRecordsModel } from '../types/statistics'
import { championshipUrl } from '../utils/championshipUrl'

export type MatchRecordsProps = {
  records: MatchRecordsModel
  scopeLabel: string
}

function RecordCard({ label, record }: { label: string; record: MatchRecord }) {
  const date = formatMatchDate(record.date)
  return (
    <div className="rounded-(--radius-lg) border border-line bg-surface p-4">
      <p className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="text-[length:var(--font-size-xl)] font-bold text-primary tabular-nums">
          {record.scoreLabel}
        </span>
        <span className="truncate text-[length:var(--font-size-sm)] text-secondary">
          vs {record.opponent}
        </span>
      </p>
      <p className="mt-1 text-[length:var(--font-size-xs)] text-muted">
        {record.championshipName}
        {date ? ` · ${date}` : ''}
      </p>
      <Link
        to={championshipUrl(record.format, record.slug)}
        className="mt-2 inline-flex min-h-6 items-center text-[length:var(--font-size-xs)] font-semibold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring) pointer-coarse:min-h-11"
      >
        Ver campeonato
      </Link>
    </div>
  )
}

export function MatchRecords({ records, scopeLabel }: MatchRecordsProps) {
  const cards: readonly { label: string; record: MatchRecord }[] = [
    ...(records.biggestWin ? [{ label: 'Mayor victoria', record: records.biggestWin }] : []),
    ...(records.biggestLoss ? [{ label: 'Mayor derrota', record: records.biggestLoss }] : []),
    ...(records.mostGoals ? [{ label: 'Más goles en un partido', record: records.mostGoals }] : []),
    ...(records.mostRecent ? [{ label: 'Partido más reciente', record: records.mostRecent }] : []),
    ...(records.earliest ? [{ label: 'Primer partido', record: records.earliest }] : []),
  ]

  if (cards.length === 0 && !records.mostFrequentScore) {
    return null
  }

  return (
    <section aria-label={`Récords de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-4">
        Récords
      </Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <RecordCard key={card.label} label={card.label} record={card.record} />
        ))}
        {records.mostFrequentScore && (
          <div className="rounded-(--radius-lg) border border-line bg-surface p-4">
            <p className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase">
              Resultado más repetido
            </p>
            <p className="mt-2 text-[length:var(--font-size-xl)] font-bold text-primary tabular-nums">
              {records.mostFrequentScore.score}
            </p>
            <p className="mt-1 text-[length:var(--font-size-xs)] text-muted">
              {records.mostFrequentScore.count} veces
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
