import { useMemo } from 'react'
import type { EChartsCoreOption } from 'echarts/core'

import type { KickoffTimeStatistics } from '../types/statistics'
import { useChartThemeTokens } from '../hooks/useChartThemeTokens'
import { formatPercent } from '../utils/formatNumber'
import { StatisticsChart, type ChartDataTable } from './charts/StatisticsChart'

export type KickoffTimeChartProps = {
  kickoffTimes: readonly KickoffTimeStatistics[]
  scopeLabel: string
}

/**
 * Matches by kickoff time as a vertical bar chart. Times are shown as recorded
 * (`HH:mm`); no time-zone conversion is applied.
 */
export function KickoffTimeChart({ kickoffTimes, scopeLabel }: KickoffTimeChartProps) {
  const tokens = useChartThemeTokens()

  const option = useMemo<EChartsCoreOption>(
    () => ({
      grid: { left: 8, right: 8, top: 16, bottom: 8, containLabel: true },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'category',
        data: kickoffTimes.map((slot) => slot.time),
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
          data: kickoffTimes.map((slot) => slot.matches),
          itemStyle: { color: tokens.tertiary, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 28,
        },
      ],
      textStyle: { color: tokens.label },
      aria: { enabled: true, label: { description: `Partidos por horario en ${scopeLabel}` } },
    }),
    [kickoffTimes, tokens, scopeLabel],
  )

  const dataTable: ChartDataTable = {
    caption: 'Partidos por horario',
    columns: ['Horario', 'Partidos', '%', '% victorias'],
    rows: kickoffTimes.map((slot) => [
      slot.time,
      slot.matches,
      formatPercent(slot.share),
      formatPercent(slot.winRate),
    ]),
  }

  if (kickoffTimes.length === 0) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-muted">
        No hay horarios registrados para esta modalidad.
      </p>
    )
  }

  return (
    <StatisticsChart
      title="Horarios más frecuentes"
      description="Cantidad de partidos según el horario registrado."
      headingLevel="h2"
      ariaSummary={`Partidos por horario en ${scopeLabel}`}
      option={option}
      dataTable={dataTable}
      height={280}
    />
  )
}
