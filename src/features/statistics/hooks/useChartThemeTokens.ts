import { useState } from 'react'

const TOKEN_NAMES = [
  'primary',
  'secondary',
  'tertiary',
  'win',
  'draw',
  'loss',
  'neutral',
  'grid',
  'label',
  'tooltip',
] as const

export type ChartTokenName = (typeof TOKEN_NAMES)[number]
export type ChartThemeTokens = Record<ChartTokenName, string>

const FALLBACK: ChartThemeTokens = {
  primary: '#873fff',
  secondary: '#c2a3ff',
  tertiary: '#38bdf8',
  win: '#10b981',
  draw: '#b7b5bf',
  loss: '#ef4444',
  neutral: '#797681',
  grid: 'rgba(194,163,255,0.16)',
  label: '#b7b5bf',
  tooltip: '#121115',
}

function resolveTokens(): ChartThemeTokens {
  if (typeof document === 'undefined') return FALLBACK
  const probe = document.createElement('span')
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  document.body.appendChild(probe)

  const resolved = {} as ChartThemeTokens
  for (const name of TOKEN_NAMES) {
    probe.style.color = ''
    probe.style.color = `var(--color-chart-${name})`
    const computed = getComputedStyle(probe).color
    resolved[name] = computed && computed !== '' ? computed : FALLBACK[name]
  }

  probe.remove()
  return resolved
}

export function useChartThemeTokens(): ChartThemeTokens {
  const [tokens] = useState<ChartThemeTokens>(resolveTokens)
  return tokens
}
