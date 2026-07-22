import { Heading } from '@/components/primitives/Heading/Heading'
import type { GeneralStatistics } from '../types/statistics'
import {
  formatAverage,
  formatInteger,
  formatPercent,
  formatSignedDifference,
} from '../utils/formatNumber'
import { OutcomeBar } from './OutcomeBar'
import { StatTile } from './StatTile'

export type HistoricalSummaryProps = {
  general: GeneralStatistics
  scopeLabel: string
}

/**
 * The headline summary: a few protagonist figures, a compact secondary grid and
 * the win/draw/loss distribution. All values belong to a single format.
 */
export function HistoricalSummary({ general, scopeLabel }: HistoricalSummaryProps) {
  const heroes = [
    {
      label: 'Torneos jugados',
      value: formatInteger(general.tournamentsPlayed),
      hint:
        general.tournamentsRegistered !== general.tournamentsPlayed
          ? `${formatInteger(general.tournamentsRegistered)} registrados`
          : undefined,
    },
    { label: 'Títulos', value: formatInteger(general.titles) },
    { label: 'Partidos jugados', value: formatInteger(general.matchesPlayed) },
    { label: 'Diferencia de gol', value: formatSignedDifference(general.goalDifference) },
  ]

  const secondary = [
    { label: 'Ganados', value: formatInteger(general.matchesWon) },
    { label: 'Empatados', value: formatInteger(general.matchesDrawn) },
    { label: 'Perdidos', value: formatInteger(general.matchesLost) },
    { label: 'Goles a favor', value: formatInteger(general.goalsFor) },
    { label: 'Goles en contra', value: formatInteger(general.goalsAgainst) },
    { label: '% de victorias', value: formatPercent(general.winRate) },
    { label: 'Promedio GF', value: formatAverage(general.goalsForPerMatch) },
    { label: 'Promedio GC', value: formatAverage(general.goalsAgainstPerMatch) },
  ]

  return (
    <section aria-label={`Resumen histórico de ${scopeLabel}`}>
      <Heading as="h2" size="xl" className="mb-4">
        Resumen histórico · {scopeLabel}
      </Heading>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {heroes.map((hero) => (
          <StatTile
            key={hero.label}
            label={hero.label}
            value={hero.value}
            {...(hero.hint ? { hint: hero.hint } : {})}
            emphasis
          />
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {secondary.map((item) => (
          <div
            key={item.label}
            className="rounded-(--radius-md) border border-line bg-surface px-3 py-3"
          >
            <dt className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase">
              {item.label}
            </dt>
            <dd className="mt-1 text-[length:var(--font-size-lg)] font-bold text-primary tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-(--radius-xl) border border-line bg-surface p-5">
        <Heading as="h3" size="md" className="mb-3">
          Distribución de resultados
        </Heading>
        <OutcomeBar
          won={general.matchesWon}
          drawn={general.matchesDrawn}
          lost={general.matchesLost}
        />
      </div>
    </section>
  )
}
