import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/renderWithProviders'
import { goalFixtures, makeGoal } from '../../test/goalFixtures'
import { GoalGallery } from './GoalGallery'

beforeAll(() => {
  // jsdom does not implement media playback; the player only needs these to
  // exist so mounting it does not throw.
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: () => Promise.resolve(),
  })
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: () => undefined,
  })
})

describe('GoalGallery', () => {
  it('shows the goals of the requested format only', () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles'],
    })

    expect(screen.getByText('4 goles')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Abrir gol de/ })).toHaveLength(4)
    expect(screen.queryByText('Lucas Iriarte')).not.toBeInTheDocument()
  })

  it('shows F5 goals when that format is requested', () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f5" />, {
      initialEntries: ['/goles?modalidad=f5'],
    })

    expect(screen.getByText('2 goles')).toBeInTheDocument()
    expect(screen.getByText('Lucas Iriarte')).toBeInTheDocument()
  })

  it('orders the newest competition first', () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles'],
    })

    const cards = screen.getAllByRole('button', { name: /^Abrir gol de/ })
    expect(cards[0]).toHaveAccessibleName(/Apertura 2026/)
    expect(cards[3]).toHaveAccessibleName(/Amistoso 2024/)
  })

  it('applies a scorer filter coming from the URL', () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?jugador=geronimo-heller'],
    })

    expect(screen.getByText('1 gol de Geronimo Heller')).toBeInTheDocument()
  })

  it('combines the tournament and scorer filters with AND', () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?torneo=apertura-2026&jugador=geronimo-heller'],
    })

    expect(screen.getByText('No encontramos goles con estos filtros.')).toBeInTheDocument()
  })

  it('clears the filters without leaving the format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?jugador=geronimo-heller'],
    })

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))

    await waitFor(() => {
      expect(screen.getByText('4 goles')).toBeInTheDocument()
    })
  })

  it('reports an empty collection instead of borrowing another format', () => {
    renderWithProviders(<GoalGallery goals={[]} format="f8" />, { initialEntries: ['/goles'] })

    expect(
      screen.getByText('Todavía no hay goles disponibles en esta modalidad.'),
    ).toBeInTheDocument()
  })

  it('renders nothing when told to hide an empty collection', () => {
    const { container } = renderWithProviders(
      <GoalGallery goals={[]} format="f8" emptyBehavior="hide" />,
      { initialEntries: ['/goles'] },
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('reveals more goals on demand', async () => {
    const user = userEvent.setup()
    const many = Array.from({ length: 30 }, (_, index) =>
      makeGoal({ id: `f8-${index}`, scorerName: `Jugador ${index}` }),
    )

    renderWithProviders(<GoalGallery goals={many} format="f8" initialVisible={24} />, {
      initialEntries: ['/goles'],
    })

    expect(screen.getAllByRole('button', { name: /^Abrir gol de/ })).toHaveLength(24)
    await user.click(screen.getByRole('button', { name: 'Mostrar más goles' }))
    expect(screen.getAllByRole('button', { name: /^Abrir gol de/ })).toHaveLength(30)
  })

  it('opens the player from a card and closes it again', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles'],
    })

    await user.click(screen.getAllByRole('button', { name: /^Abrir gol de/ })[0]!)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Gol 1 de 4')

    await user.click(screen.getByRole('button', { name: 'Cerrar el reproductor' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('navigates inside the filtered collection and closes both ends', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles'],
    })

    await user.click(screen.getAllByRole('button', { name: /^Abrir gol de/ })[0]!)
    await screen.findByRole('dialog')

    expect(screen.getByRole('button', { name: 'Gol anterior' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Gol siguiente' }))
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveTextContent('Gol 2 de 4')
    })
  })

  it('keeps navigation inside a scorer filter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?jugador=lorenzo-minervino'],
    })

    await user.click(screen.getAllByRole('button', { name: /^Abrir gol de/ })[0]!)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Gol 1 de 2')
  })

  it('opens the player directly from a shared URL', async () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?gol=f8-b1'],
    })

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Geronimo Heller')
  })

  it('reports a shared goal that no longer exists without breaking', async () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?gol=desaparecido'],
    })

    expect(await screen.findByText('Ese gol ya no está disponible.')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('4 goles')).toBeInTheDocument()
  })

  it('opens a random goal from the filtered collection', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?jugador=lorenzo-minervino'],
    })

    await user.click(screen.getByRole('button', { name: /Ver un gol al azar/ }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Lorenzo Minervino')
    expect(dialog).toHaveTextContent('de 2')
  })

  it('disables the random button when nothing matches', () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?torneo=apertura-2026&jugador=geronimo-heller'],
    })

    expect(screen.getByRole('button', { name: /Ver un gol al azar/ })).toBeDisabled()
  })

  it('exposes the playback speeds and the zoom controls', async () => {
    const user = userEvent.setup()
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?gol=f8-a1'],
    })

    await screen.findByRole('dialog')

    expect(screen.getByRole('button', { name: 'Acercar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alejar' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Acercar' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Alejar' })).toBeEnabled()
    })
    expect(screen.getByText('1.5x')).toBeInTheDocument()
  })

  it('offers a download with a readable name', async () => {
    renderWithProviders(<GoalGallery goals={goalFixtures} format="f8" />, {
      initialEntries: ['/goles?gol=f8-a1'],
    })

    await screen.findByRole('dialog')
    const link = screen.getByRole('link', { name: /Descargar/ })
    expect(link).toHaveAttribute('download', 'solares-f8-apertura-2026-lorenzo-minervino.mp4')
  })
})
