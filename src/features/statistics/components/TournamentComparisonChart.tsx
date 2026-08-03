import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EChartsCoreOption } from 'echarts/core'

import { parseSeasonName } from '@/features/championships/utils/parseSeasonName'
import type { TournamentStatistics } from '../types/statistics'
import { useChartThemeTokens } from '../hooks/useChartThemeTokens'
import { championshipUrl } from '../utils/championshipUrl'
import { formatPercent } from '../utils/formatNumber'
import { StatisticsChart, type ChartDataTable } from './charts/StatisticsChart'

export type TournamentComparisonChartProps = {
  tournaments: readonly TournamentStatistics[]
  scopeLabel: string
}

type Metric = {
  key: string
  label: string
  value: (tournament: TournamentStatistics) => number
  format: (tournament: TournamentStatistics) => string
}

const METRICS: readonly Metric[] = [
  {
    key: 'matches',
    label: 'Partidos jugados',
    value: (t) => t.matches,
    format: (t) => String(t.matches),
  },
  { key: 'wins', label: 'Victorias', value: (t) => t.wins, format: (t) => String(t.wins) },
  {
    key: 'winRate',
    label: '% de victorias',
    value: (t) => Math.round((t.winRate ?? 0) * 1000) / 10,
    format: (t) => formatPercent(t.winRate),
  },
  {
    key: 'goalsFor',
    label: 'Goles a favor',
    value: (t) => t.goalsFor,
    format: (t) => String(t.goalsFor),
  },
  {
    key: 'goalsAgainst',
    label: 'Goles en contra',
    value: (t) => t.goalsAgainst,
    format: (t) => String(t.goalsAgainst),
  },
  {
    key: 'goalDifference',
    label: 'Diferencia de gol',
    value: (t) => t.goalDifference,
    format: (t) => String(t.goalDifference),
  },
  {
    key: 'cleanSheets',
    label: 'Arcos en cero',
    value: (t) => t.cleanSheets,
    format: (t) => String(t.cleanSheets),
  },
]

export function TournamentComparisonChart({
  tournaments,
  scopeLabel,
}: TournamentComparisonChartProps) {
  const [metricKey, setMetricKey] = useState<string>('matches')
  const tokens = useChartThemeTokens()
  const navigate = useNavigate()
  const selectId = useId()
  const metric = METRICS.find((item) => item.key === metricKey) ?? METRICS[0]!

  const ordered = useMemo(() => {
    const chronology = (name: string) => parseSeasonName(name).recency || Number.MAX_SAFE_INTEGER
    return [...tournaments].sort(
      (a, b) =>
        chronology(a.championshipName) - chronology(b.championshipName) ||
        a.championshipName.localeCompare(b.championshipName, 'es'),
    )
  }, [tournaments])

  const option = useMemo<EChartsCoreOption>(() => {
    const names = ordered.map((tournament) => tournament.championshipName)
    const values = ordered.map((tournament) => metric.value(tournament))
    return {
      grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'value',
        axisLabel: { color: tokens.label },
        splitLine: { lineStyle: { color: tokens.grid } },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: names,
        axisLabel: { color: tokens.label },
        axisLine: { lineStyle: { color: tokens.grid } },
      },
      series: [
        {
          type: 'bar',
          data: values,
          itemStyle: { color: tokens.primary, borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 22,
        },
      ],
      textStyle: { color: tokens.label },
      aria: {
        enabled: true,
        label: { description: `${metric.label} por campeonato en ${scopeLabel}` },
      },
    }
  }, [ordered, metric, tokens, scopeLabel])

  const dataTable: ChartDataTable = {
    caption: `${metric.label} por campeonato`,
    columns: ['Campeonato', metric.label],
    rows: ordered.map((tournament) => [tournament.championshipName, metric.format(tournament)]),
  }

  if (tournaments.length === 0) return null

  const toolbar = (
    <div>
      <label
        htmlFor={selectId}
        className="mb-1 block text-[length:var(--font-size-sm)] font-medium text-secondary"
      >
        Métrica
      </label>
      <select
        id={selectId}
        value={metricKey}
        onChange={(event) => setMetricKey(event.target.value)}
        className="rounded-(--radius-md) border border-line bg-surface px-3 py-2 text-[length:var(--font-size-sm)] text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)"
      >
        {METRICS.map((item) => (
          <option key={item.key} value={item.key}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <StatisticsChart
      title="Rendimiento por campeonato"
      description="Compará los campeonatos según la métrica elegida. Tocá una barra para ver ese campeonato."
      headingLevel="h2"
      ariaSummary={`${metric.label} por campeonato en ${scopeLabel}`}
      option={option}
      dataTable={dataTable}
      height={Math.max(220, ordered.length * 34)}
      toolbar={toolbar}
      onSelect={(index) => {
        const tournament = ordered[index]
        if (tournament) void navigate(championshipUrl(tournament.format, tournament.slug))
      }}
    />
  )
}
