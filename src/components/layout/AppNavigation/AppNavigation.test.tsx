import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'

import { navigationItems } from '@/config/navigation.config'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AppNavigation } from './AppNavigation'

describe('AppNavigation', () => {
  it('renders every navigation item as a link', () => {
    renderWithProviders(<AppNavigation />)
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })

    for (const item of navigationItems) {
      const link = within(nav).getByRole('link', { name: item.label })
      expect(link).toHaveAttribute('href', item.path)
    }
  })

  it('places Historia between Inicio and Campeonatos', () => {
    renderWithProviders(<AppNavigation />)
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent)

    const inicio = labels.indexOf('Inicio')
    const historia = labels.indexOf('Historia')
    const campeonatos = labels.indexOf('Campeonatos')

    expect(inicio).toBeGreaterThanOrEqual(0)
    expect(historia).toBe(inicio + 1)
    expect(campeonatos).toBe(historia + 1)
  })

  it('marks the active route with aria-current', () => {
    renderWithProviders(<AppNavigation />, { initialEntries: ['/goles'] })
    const activeLink = screen.getByRole('link', { name: 'Goles' })
    expect(activeLink).toHaveAttribute('aria-current', 'page')
  })
})
