import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/renderWithProviders'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders a single level-one heading with the team name', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Solares' })).toBeInTheDocument()
  })

  it('renders the presentation text', () => {
    renderWithProviders(<HomePage />)
    expect(
      screen.getByText('Solares, el equipo de fútbol amateur más grande del mundo.'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Nos dicen el Torito Violeta/)).toBeInTheDocument()
  })

  it('renders the crests and kits sections', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('heading', { level: 2, name: 'Nuestros escudos' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Nuestras camisetas' }),
    ).toBeInTheDocument()
  })

  it('links to the history page', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('link', { name: /Conocé nuestra historia/ })).toHaveAttribute(
      'href',
      '/historia',
    )
  })

  it('renders images with non-empty alternative text', () => {
    renderWithProviders(<HomePage />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      expect(image).toHaveAccessibleName()
    }
  })
})
