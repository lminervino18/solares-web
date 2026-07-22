import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '@/test/renderWithProviders'
import { MobileNavigation } from './MobileNavigation'

describe('MobileNavigation', () => {
  it('opens the menu and shows the navigation links', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MobileNavigation />)

    await user.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
  })

  it('closes the menu when pressing Escape', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MobileNavigation />)

    await user.click(screen.getByRole('button', { name: 'Abrir menú de navegación' }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
