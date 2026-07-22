import { screen, waitFor } from '@testing-library/react'
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
