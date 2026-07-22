import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/renderWithProviders'
import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('renders the not-found heading and a link back home', () => {
    renderWithProviders(<NotFoundPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Página no encontrada' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  })
})
