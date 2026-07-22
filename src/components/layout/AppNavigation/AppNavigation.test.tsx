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

  it('marks the active route with aria-current', () => {
    renderWithProviders(<AppNavigation />, { initialEntries: ['/goles'] })
    const activeLink = screen.getByRole('link', { name: 'Goles' })
    expect(activeLink).toHaveAttribute('aria-current', 'page')
  })
})
