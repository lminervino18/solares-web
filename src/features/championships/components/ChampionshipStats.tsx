import { cn } from '@/lib/cn'
import type { ChampionshipStats as Stats } from '../types/championships'

export type ChampionshipStatsProps = {
  stats: Stats
  hasMatches: boolean
  className?: string
}

type StatItem = {
  abbr: string
  label: string
  value: number
  emphasis?: boolean
}

function buildItems(stats: Stats): readonly StatItem[] {
  return [
    { abbr: 'PJ', label: 'Partidos jugados', value: stats.played },
    { abbr: 'PG', label: 'Partidos ganados', value: stats.won },
    { abbr: 'PE', label: 'Partidos empatados', value: stats.drawn },
    { abbr: 'PP', label: 'Partidos perdidos', value: stats.lost },
    { abbr: 'GF', label: 'Goles a favor', value: stats.goalsFor },
    { abbr: 'GC', label: 'Goles en contra', value: stats.goalsAgainst },
    { abbr: 'DG', label: 'Diferencia de gol', value: stats.goalDifference, emphasis: true },
  ]
}

function formatValue(item: StatItem): string {
  if (item.emphasis && item.value > 0) return `+${item.value}`
  return String(item.value)
}

/**
 * Shows the derived statistics for the active championship as a definition
 * list with abbreviated headers and accessible full names.
 */
export function ChampionshipStats({ stats, hasMatches, className }: ChampionshipStatsProps) {
  const items = buildItems(stats)

  return (
    <div className={className}>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {items.map((item) => (
          <div
            key={item.abbr}
            className="flex flex-col items-center gap-1 rounded-(--radius-md) border border-line bg-surface-elevated px-2 py-3 text-center"
          >
            <dt className="text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted">
              <abbr title={item.label} className="no-underline">
                {item.abbr}
              </abbr>
            </dt>
            <dd
              className={cn(
                'text-[length:var(--font-size-lg)] font-bold text-primary tabular-nums',
                item.emphasis && 'text-brand',
              )}
            >
              {formatValue(item)}
            </dd>
          </div>
        ))}
      </dl>
      {!hasMatches && (
        <p className="mt-3 text-[length:var(--font-size-sm)] text-muted">
          Todavía no hay partidos cargados para este campeonato.
        </p>
      )}
    </div>
  )
}
