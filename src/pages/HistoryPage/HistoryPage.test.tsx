import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/renderWithProviders'
import { historyChapters, historyPhotos } from '@/data/history'
import { HistoryPage } from './HistoryPage'

describe('HistoryPage', () => {
  it('renders a single level-one heading', () => {
    renderWithProviders(<HistoryPage />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('La historia de Solares')
  })

  it('renders the eight chapters as headings', () => {
    renderWithProviders(<HistoryPage />)
    expect(historyChapters).toHaveLength(8)
    for (const chapter of historyChapters) {
      expect(screen.getByRole('heading', { level: 2, name: chapter.title })).toBeInTheDocument()
    }
  })

  it('renders the internal chapter navigation with anchors', () => {
    renderWithProviders(<HistoryPage />)
    const firstChapter = historyChapters[0]
    expect(firstChapter).toBeDefined()
    const link = screen.getByRole('link', { name: `Capítulo 1: ${firstChapter?.title ?? ''}` })
    expect(link).toHaveAttribute('href', `#${firstChapter?.id ?? ''}`)
  })

  it('renders the final gallery photos', () => {
    renderWithProviders(<HistoryPage />)
    for (const photoId of ['photo-5', 'photo-6', 'photo-7', 'photo-8']) {
      const photo = historyPhotos[photoId]
      expect(photo).toBeDefined()
      expect(screen.getByRole('img', { name: photo?.alt ?? '' })).toBeInTheDocument()
    }
  })

  it('renders the plaza map where it is narrated', () => {
    renderWithProviders(<HistoryPage />)
    expect(
      screen.getByTitle('Mapa de la plaza de Los Tordos en Cipolletti, Río Negro'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Abrir en Google Maps/ })).toHaveAttribute(
      'href',
      'https://maps.app.goo.gl/vQKr48LTRRuHgCWj6',
    )
  })
})
