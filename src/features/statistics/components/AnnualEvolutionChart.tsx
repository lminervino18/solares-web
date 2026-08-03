import { useId, useMemo, useState } from 'react'
import type { EChartsCoreOption } from 'echarts/core'

import type { AnnualStatistics } from '../types/statistics'
import { useChartThemeTokens } from '../hooks/useChartThemeTokens'
import { StatisticsChart, type ChartDataTable } from './charts/StatisticsChart'

export type AnnualEvolutionChartProps = {
  annual: readonly AnnualStatistics[]
  scopeLabel: string
}

type Metric = { key: string; label: string; value: (year: AnnualStatistics) => number }

const METRICS: readonly Metric[] = [
  { key: 'matches', label: 'Partidos', value: (y) => y.matches },
  { key: 'wins', label: 'Victorias', value: (y) => y.wins },
  { key: 'goalsFor', label: 'Goles a favor', value: (y) => y.goalsFor },
  { key: 'goalsAgainst', label: 'Goles en contra', value: (y) => y.goalsAgainst },
  { key: 'titles', label: 'Títulos', value: (y) => y.titles },
]

export function AnnualEvolutionChart({ annual, scopeLabel }: AnnualEvolutionChartProps) {
  const [metricKey, setMetricKey] = useState('matches')
  const tokens = useChartThemeTokens()
  const selectId = useId()
  const metric = METRICS.find((item) => item.key === metricKey) ?? METRICS[0]!

  const option = useMemo<EChartsCoreOption>(
    () => ({
      grid: { left: 8, right: 8, top: 16, bottom: 8, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: annual.map((year) => String(year.year)),
        axisLabel: { color: tokens.label },
        axisLine: { lineStyle: { color: tokens.grid } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: tokens.label },
        splitLine: { lineStyle: { color: tokens.grid } },
      },
      series: [
        {
          type: 'bar',
          data: annual.map((year) => metric.value(year)),
          itemStyle: { color: tokens.primary, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 40,
        },
      ],
      textStyle: { color: tokens.label },
      aria: { enabled: true, label: { description: `${metric.label} por año en ${scopeLabel}` } },
    }),
    [annual, metric, tokens, scopeLabel],
  )

  const dataTable: ChartDataTable = {
    caption: `${metric.label} por año`,
    columns: ['Año', metric.label],
    rows: annual.map((year) => [year.year, metric.value(year)]),
  }

  if (annual.length === 0) return null

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
      title="Evolución por año"
      description="Solo considera partidos con fecha registrada."
      headingLevel="h2"
      ariaSummary={`${metric.label} por año en ${scopeLabel}`}
      option={option}
      dataTable={dataTable}
      height={280}
      toolbar={toolbar}
    />
  )
}
