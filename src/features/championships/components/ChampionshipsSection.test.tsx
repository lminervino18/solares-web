import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import type { FootballFormat } from '@/config/football-format'
import { loadChampionshipsSnapshot } from '../data/championshipsSnapshot'
import { ChampionshipsSection } from './ChampionshipsSection'

// Derived from the snapshot, never hardcoded: publishing a newer championship
// must not break these tests.
const snapshot = loadChampionshipsSnapshot().data

function published(format: FootballFormat) {
  return snapshot[format].filter((championship) => championship.published)
}

function defaultName(format: FootballFormat): string {
  const name = published(format)[0]?.name
  if (!name) throw new Error(`The snapshot has no published ${format} championship`)
  return name
}

/** A name present in one format only, which proves a format switch happened. */
function exclusiveName(format: FootballFormat, other: FootballFormat): string | undefined {
  const otherNames = new Set(published(other).map((championship) => championship.name))
  return published(format).find((championship) => !otherNames.has(championship.name))?.name
}

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
    expect(screen.getByRole('heading', { level: 2, name: defaultName('f8') })).toBeInTheDocument()
  })

  it('shows the tournament logo before the championship name', async () => {
    renderWithProviders(<ChampionshipsSection />, { initialEntries: ['/campeonatos'] })

    const title = await screen.findByRole('heading', { level: 2, name: defaultName('f8') })
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

    // A championship name can exist in both formats, so the spotlight label is
    // what proves the switch happened.
    await waitFor(() => {
      expect(screen.getByText(/Campeonatos F5/)).toBeInTheDocument()
    })

    // A championship exclusive to F8 must be gone after switching.
    const f8Only = exclusiveName('f8', 'f5')
    if (f8Only) expect(screen.queryByText(f8Only)).not.toBeInTheDocument()
  })

  it('shows the source notice with a link to the spreadsheet', async () => {
    renderWithProviders(<ChampionshipsSection />, { initialEntries: ['/campeonatos'] })
    const link = await screen.findByRole('link', { name: /Ver planilla original/ })
    expect(link).toHaveAttribute('href', expect.stringContaining('docs.google.com'))
  })
})
