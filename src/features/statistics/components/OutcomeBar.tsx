import { formatPercent } from '../utils/formatNumber'

export type OutcomeBarProps = {
  won: number
  drawn: number
  lost: number
}

type Segment = {
  key: string
  label: string
  value: number
  token: string
}

export function OutcomeBar({ won, drawn, lost }: OutcomeBarProps) {
  const total = won + drawn + lost
  const segments: readonly Segment[] = [
    { key: 'win', label: 'Ganados', value: won, token: 'var(--color-chart-win)' },
    { key: 'draw', label: 'Empatados', value: drawn, token: 'var(--color-chart-draw)' },
    { key: 'loss', label: 'Perdidos', value: lost, token: 'var(--color-chart-loss)' },
  ]

  if (total === 0) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-muted">
        Todavía no hay partidos suficientes para mostrar la distribución.
      </p>
    )
  }

  return (
    <div>
      <div
        className="flex h-9 w-full overflow-hidden rounded-(--radius-pill) border border-line"
        role="img"
        aria-label={`Distribución de resultados: ${won} ganados, ${drawn} empatados, ${lost} perdidos`}
      >
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <div
              key={segment.key}
              className="flex items-center justify-center text-[length:var(--font-size-sm)] font-bold text-canvas"
              style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.token }}
            >
              {segment.value / total >= 0.08 ? segment.value : ''}
            </div>
          ))}
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((segment) => (
          <div key={segment.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: segment.token }}
            />
            <dt className="text-[length:var(--font-size-sm)] text-secondary">{segment.label}</dt>
            <dd className="text-[length:var(--font-size-sm)] font-semibold text-primary tabular-nums">
              {segment.value} · {formatPercent(segment.value / total)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
