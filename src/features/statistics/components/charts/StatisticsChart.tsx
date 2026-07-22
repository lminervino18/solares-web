import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ECharts, EChartsCoreOption } from 'echarts/core'

import { cn } from '@/lib/cn'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { Button } from '@/components/primitives/Button/Button'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

export type ChartDataTable = {
  readonly caption: string
  readonly columns: readonly string[]
  readonly rows: readonly (readonly (string | number)[])[]
}

export type StatisticsChartProps = {
  title: string
  description?: string
  ariaSummary: string
  option: EChartsCoreOption
  dataTable: ChartDataTable
  height?: number
  headingLevel?: 'h2' | 'h3' | 'h4'
  onSelect?: (index: number) => void
  toolbar?: ReactNode
}

/**
 * Accessible ECharts wrapper: a titled chart with a described SVG canvas and a
 * disclosure that reveals the same data as a semantic table. ECharts is loaded
 * dynamically, resizes with its container and honours reduced motion.
 */
export function StatisticsChart({
  title,
  description,
  ariaSummary,
  option,
  dataTable,
  height = 320,
  headingLevel = 'h3',
  onSelect,
  toolbar,
}: StatisticsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)
  const onSelectRef = useRef(onSelect)
  const [ready, setReady] = useState(false)
  const [showData, setShowData] = useState(false)
  const prefersReducedMotion = useReducedMotionPreference()

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    let disposed = false
    let observer: ResizeObserver | undefined

    void import('./echartsSetup').then(({ echarts }) => {
      if (disposed || !containerRef.current) return
      const chart = echarts.init(containerRef.current, undefined, { renderer: 'svg' })
      chartRef.current = chart
      chart.on('click', (params: { dataIndex?: number }) => {
        if (typeof params.dataIndex === 'number') onSelectRef.current?.(params.dataIndex)
      })
      observer = new ResizeObserver(() => chart.resize())
      observer.observe(containerRef.current)
      setReady(true)
    })

    return () => {
      disposed = true
      observer?.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!ready || !chartRef.current) return
    chartRef.current.setOption({ animation: !prefersReducedMotion, ...option }, true)
  }, [ready, option, prefersReducedMotion])

  return (
    <section className="rounded-(--radius-xl) border border-line bg-surface p-5">
      <Heading as={headingLevel} size="lg">
        {title}
      </Heading>
      {description && (
        <Text as="p" size="sm" tone="secondary" className="mt-1">
          {description}
        </Text>
      )}

      {toolbar && <div className="mt-4">{toolbar}</div>}

      <div
        ref={containerRef}
        role="img"
        aria-label={ariaSummary}
        className="mt-4 w-full"
        style={{ height }}
      />

      <div className="mt-3">
        <Button
          type="button"
          tone="neutral"
          variant="text"
          size="sm"
          aria-expanded={showData}
          onClick={() => setShowData((value) => !value)}
        >
          {showData ? 'Ocultar datos del gráfico' : 'Ver datos del gráfico'}
        </Button>
      </div>

      {showData && (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{dataTable.caption}</caption>
            <thead>
              <tr className="border-b border-line">
                {dataTable.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-2 py-2 text-[length:var(--font-size-xs)] font-semibold tracking-wide text-muted uppercase"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataTable.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-line/60">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        'px-2 py-1.5 text-[length:var(--font-size-sm)]',
                        cellIndex === 0 ? 'text-primary' : 'text-secondary tabular-nums',
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
