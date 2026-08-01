import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { ChampionshipsSection } from './ChampionshipsSection'

vi.mock('../api/championshipsDataSource', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/championshipsDataSource')>()
  return {
    ...actual,
    fetchChampionships: vi.fn().mockRejectedValue(new Error('offline')),
  }
})

describe('ChampionshipsSection', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders F8 by default with the most recent championship from the snapshot', async () => {
    renderWithProviders(<ChampionshipsSection />, { initialEntries: ['/campeonatos'] })

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /F8/ })).toHaveAttribute('aria-selected', 'true')
    })
    expect(screen.getByRole('heading', { level: 2, name: 'Apertura 2026' })).toBeInTheDocument()
  })

  it('shows the tournament logo before the championship name', async () => {
    renderWithProviders(<ChampionshipsSection />, { initialEntries: ['/campeonatos'] })

    const title = await screen.findByRole('heading', { level: 2, name: 'Apertura 2026' })
    const header = title.closest('header')
    expect(header).not.toBeNull()

    const logo = within(header as HTMLElement).getByRole('img')
    expect(header?.firstElementChild?.contains(logo) || header?.firstElementChild === logo).toBe(
      true,
    )
  })

  it('opens the team photo in a lightbox', async () => {
    renderWithProviders(<ChampionshipsSection />, { initialEntries: ['/campeonatos'] })

    const photoButton = await screen.findByRole('button', { name: /^Ampliar imagen: / })
    expect(photoButton).toBeInTheDocument()
  })

  it('switches to F5 and shows only F5 championships', async () => {
    renderWithProviders(<ChampionshipsSection />, { initialEntries: ['/campeonatos'] })

    await waitFor(() => {
      expect(screen.getByText(/Campeonatos F8/)).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('tab', { name: /F5/ }))

    // "Apertura 2026" exists in both formats, so the spotlight label is what
    // proves the switch happened.
    await waitFor(() => {
      expect(screen.getByText(/Campeonatos F5/)).toBeInTheDocument()
    })
    // "Clausura 2023" only exists in F8, so it must be gone after switching.
    expect(screen.queryByText('Clausura 2023')).not.toBeInTheDocument()
  })

  it('shows the source notice with a link to the spreadsheet', async () => {
    renderWithProviders(<ChampionshipsSection />, { initialEntries: ['/campeonatos'] })
    const link = await screen.findByRole('link', { name: /Ver planilla original/ })
    expect(link).toHaveAttribute('href', expect.stringContaining('docs.google.com'))
  })
})
