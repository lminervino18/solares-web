import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/renderWithProviders'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders a single level-one heading with the team name', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Solares' })).toBeInTheDocument()
  })
})
