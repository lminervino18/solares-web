import { useMemo } from 'react'
import type { EChartsCoreOption } from 'echarts/core'

import type { VenueStatistics } from '../types/statistics'
import { useChartThemeTokens } from '../hooks/useChartThemeTokens'
import { formatPercent } from '../utils/formatNumber'
import { StatisticsChart, type ChartDataTable } from './charts/StatisticsChart'

export type VenueChartProps = {
  venues: readonly VenueStatistics[]
  scopeLabel: string
}

export function VenueChart({ venues, scopeLabel }: VenueChartProps) {
  const tokens = useChartThemeTokens()

  const option = useMemo<EChartsCoreOption>(() => {
    const ordered = [...venues].reverse()
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
        data: ordered.map((venue) => venue.venueName),
        axisLabel: { color: tokens.label },
        axisLine: { lineStyle: { color: tokens.grid } },
      },
      series: [
        {
          type: 'bar',
          data: ordered.map((venue) => venue.matches),
          itemStyle: { color: tokens.secondary, borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 22,
        },
      ],
      textStyle: { color: tokens.label },
      aria: { enabled: true, label: { description: `Partidos por sede en ${scopeLabel}` } },
    }
  }, [venues, tokens, scopeLabel])

  const dataTable: ChartDataTable = {
    caption: 'Partidos por sede',
    columns: ['Sede', 'Partidos', '%', '% victorias'],
    rows: venues.map((venue) => [
      venue.venueName,
      venue.matches,
      formatPercent(venue.share),
      formatPercent(venue.winRate),
    ]),
  }

  if (venues.length === 0) {
    return <p className="text-[length:var(--font-size-sm)] text-muted">No hay sedes registradas.</p>
  }

  return (
    <StatisticsChart
      title="Sedes más frecuentes"
      description="Cantidad de partidos disputados en cada sede."
      headingLevel="h2"
      ariaSummary={`Partidos por sede en ${scopeLabel}`}
      option={option}
      dataTable={dataTable}
      height={Math.max(200, venues.length * 34)}
    />
  )
}
