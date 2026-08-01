import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { StatisticsSection } from './StatisticsSection'

vi.mock('@/features/championships/api/championshipsDataSource', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/championships/api/championshipsDataSource')>()
  return { ...actual, fetchChampionships: vi.fn().mockRejectedValue(new Error('offline')) }
})

vi.mock('./charts/echartsSetup', () => ({
  echarts: {
    init: () => ({
      setOption: () => {},
      resize: () => {},
      dispose: () => {},
      on: () => {},
    }),
  },
}))

describe('StatisticsSection', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders F8 by default with the historical summary from the snapshot', async () => {
    renderWithProviders(<StatisticsSection />, { initialEntries: ['/estadisticas'] })

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /F8/ })).toHaveAttribute('aria-selected', 'true')
    })
    expect(
      screen.getByRole('heading', { name: /Resumen histórico · Fútbol 8/ }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Lorenzo Minervino').length).toBeGreaterThan(0)
  })

  it('shows the championship honors as a podium without the empty other-titles tile', async () => {
    renderWithProviders(<StatisticsSection />, { initialEntries: ['/estadisticas'] })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Logros en campeonatos' })).toBeInTheDocument()
    })

    expect(screen.getByText('Campeón de Oro')).toBeInTheDocument()
    expect(screen.getByText('Subcampeonatos de Oro')).toBeInTheDocument()
    expect(screen.getByText('Semifinales')).toBeInTheDocument()
    expect(screen.queryByText('Otros títulos')).not.toBeInTheDocument()
    expect(screen.queryByText('Campeón de Plata')).not.toBeInTheDocument()
  })

  it('lists the tournament comparison in chronological order', async () => {
    renderWithProviders(<StatisticsSection />, { initialEntries: ['/estadisticas'] })

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Rendimiento por campeonato' }),
      ).toBeInTheDocument()
    })

    const chart = screen
      .getByRole('heading', { name: 'Rendimiento por campeonato' })
      .closest('section')
    expect(chart).not.toBeNull()
    await userEvent.click(
      within(chart as HTMLElement).getByRole('button', { name: 'Ver datos del gráfico' }),
    )

    const names = within(chart as HTMLElement)
      .getAllByRole('row')
      .slice(1)
      .map((row) => row.querySelector('th,td')?.textContent ?? '')

    const seasons = names.map((name) => {
      const year = Number(/(20\d{2})/.exec(name)?.[1] ?? 0)
      const weight = name.toLowerCase().includes('clausura') ? 2 : 1
      return year * 10 + weight
    })
    expect(seasons).toEqual([...seasons].sort((a, b) => a - b))
    expect(seasons.length).toBeGreaterThan(1)
  })

  it('switches to F5', async () => {
    renderWithProviders(<StatisticsSection />, { initialEntries: ['/estadisticas'] })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Resumen histórico · Fútbol 8/ }),
      ).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('tab', { name: /F5/ }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Resumen histórico · Fútbol 5/ }),
      ).toBeInTheDocument()
    })
  })

  it('expands the full scorers table with a search box', async () => {
    renderWithProviders(<StatisticsSection />, { initialEntries: ['/estadisticas'] })
    const toggle = await screen.findByRole('button', { name: 'Ver tabla completa' })
    await userEvent.click(toggle)
    expect(screen.getByLabelText('Buscar jugador')).toBeInTheDocument()
  })
})
