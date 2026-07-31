import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { EditorialGallery, type EditorialGalleryPhoto } from './EditorialGallery'

const photos: readonly EditorialGalleryPhoto[] = [
  { id: 'first', src: '/first.jpg', webp: '/first.webp', width: 800, height: 600, alt: 'Primera' },
  {
    id: 'second',
    src: '/second.jpg',
    webp: '/second.webp',
    width: 800,
    height: 600,
    alt: 'Segunda',
  },
  { id: 'third', src: '/third.jpg', webp: '/third.webp', width: 800, height: 600, alt: 'Tercera' },
]

describe('EditorialGallery', () => {
  it('renders the photos in the received order', () => {
    render(<EditorialGallery photos={photos} label="Galería" />)
    const alternativeTexts = screen.getAllByRole('img').map((image) => image.getAttribute('alt'))
    expect(alternativeTexts).toEqual(['Primera', 'Segunda', 'Tercera'])
  })

  it('adapts to any number of photos', () => {
    const { rerender } = render(<EditorialGallery photos={photos.slice(0, 1)} label="Galería" />)
    expect(screen.getAllByRole('img')).toHaveLength(1)

    rerender(<EditorialGallery photos={photos} label="Galería" />)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('opens each photo through a labelled button when the lightbox is enabled', () => {
    render(<EditorialGallery photos={photos} label="Galería" />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Ampliar imagen: Primera' })).toBeInTheDocument()
  })

  it('renders plain images when the lightbox is disabled', () => {
    render(<EditorialGallery photos={photos} label="Galería" withLightbox={false} />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('exposes the collection as a labelled group', () => {
    render(<EditorialGallery photos={photos} label="Galería de Cambalache" />)
    expect(screen.getByRole('group', { name: 'Galería de Cambalache' })).toBeInTheDocument()
  })

  it('renders nothing when no photo could be resolved', () => {
    const { container } = render(<EditorialGallery photos={[]} label="Galería" />)
    expect(container).toBeEmptyDOMElement()
  })
})
