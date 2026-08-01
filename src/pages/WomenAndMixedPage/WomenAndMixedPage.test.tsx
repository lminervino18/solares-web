import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'

import { renderWithProviders } from '@/test/renderWithProviders'
import { womenAndMixedMedia } from '@/data/womenAndMixed'
import { currentCrestImage } from '@/data/brand'
import { WomenAndMixedPage } from './WomenAndMixedPage'

const { cambalache, cambalares } = womenAndMixedMedia

function getSection(id: string): HTMLElement {
  const section = document.getElementById(id)
  expect(section).not.toBeNull()
  return section as HTMLElement
}

describe('WomenAndMixedPage', () => {
  it('renders a single level-one heading', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Femenino y Mixto')
  })

  it('links the internal navigation to both sections', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const navigation = screen.getByRole('navigation', { name: 'Secciones de la página' })
    expect(within(navigation).getByRole('link', { name: 'Femenino' })).toHaveAttribute(
      'href',
      '#femenino',
    )
    expect(within(navigation).getByRole('link', { name: 'Mixto' })).toHaveAttribute(
      'href',
      '#mixto',
    )
  })

  it('renders both sections with their headings', () => {
    renderWithProviders(<WomenAndMixedPage />)
    expect(getSection('femenino')).toBeInTheDocument()
    expect(getSection('mixto')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Cambalache' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Cambalares' })).toBeInTheDocument()
  })

  it('renders the Cambalache presentation text', () => {
    renderWithProviders(<WomenAndMixedPage />)
    expect(
      screen.getByText(/Aunque Solares no cuenta con una rama femenina propia/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/unidos por valores y una forma muy parecida de vivir el fútbol y la vida/),
    ).toBeInTheDocument()
  })

  it('links to the Instagram account of each team', () => {
    renderWithProviders(<WomenAndMixedPage />)
    expect(screen.getByRole('link', { name: 'Seguir a Cambalache en Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/cambalachefutbol',
    )
    expect(screen.getByRole('link', { name: 'Seguir a Cambalares en Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/cambalares',
    )
  })

  it('renders the crest and the flag of Cambalache inside the women section', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const section = within(getSection('femenino'))
    expect(section.getByRole('img', { name: cambalache.crest.alt })).toBeInTheDocument()
    expect(section.getByRole('img', { name: cambalache.flag.alt })).toBeInTheDocument()
  })

  it('renders the Cambalache photos in the manifest order', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const gallery = screen.getByRole('group', { name: 'Fotografías de Cambalache' })
    const alternativeTexts = within(gallery)
      .getAllByRole('img')
      .map((image) => image.getAttribute('alt'))
    expect(alternativeTexts).toEqual(cambalache.teamPhotos.map((photo) => photo.alt))
  })

  it('renders the relationship text with the coaches photo in its own block', () => {
    renderWithProviders(<WomenAndMixedPage />)
    expect(screen.getByRole('heading', { level: 3, name: 'Vínculos' })).toBeInTheDocument()
    expect(
      screen.getByText('Los capitanes de Solares son DTs de Cambalache desde 2023.'),
    ).toBeInTheDocument()

    const coaches = screen.getByRole('group', { name: 'Directores técnicos de Cambalache' })
    const images = within(coaches).getAllByRole('img')
    expect(images).toHaveLength(1)
    expect(images[0]).toHaveAttribute('alt', cambalache.coachesPhoto.alt)
  })

  it('renders the photos supporting Solares in their own block', () => {
    renderWithProviders(<WomenAndMixedPage />)
    expect(
      screen.getByText(/Las jugadoras de Cambalache son hinchas fieles del Torito/),
    ).toBeInTheDocument()

    const gallery = screen.getByRole('group', { name: 'Cambalache alentando a Solares' })
    const alternativeTexts = within(gallery)
      .getAllByRole('img')
      .map((image) => image.getAttribute('alt'))
    expect(alternativeTexts).toEqual(cambalache.supportingSolaresPhotos.map((photo) => photo.alt))
  })

  it('keeps the Cambalache and Cambalares photos in separate sections', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const womenSection = within(getSection('femenino'))
    const mixedSection = within(getSection('mixto'))

    for (const photo of cambalache.teamPhotos) {
      expect(womenSection.getByRole('img', { name: photo.alt })).toBeInTheDocument()
      expect(mixedSection.queryByRole('img', { name: photo.alt })).toBeNull()
    }
    for (const photo of cambalares.teamPhotos) {
      expect(mixedSection.getByRole('img', { name: photo.alt })).toBeInTheDocument()
      expect(womenSection.queryByRole('img', { name: photo.alt })).toBeNull()
    }
  })

  it('renders the Cambalares presentation text', () => {
    renderWithProviders(<WomenAndMixedPage />)
    expect(
      screen.getByText(
        /De manera esporádica, Solares y Cambalache se unen para disputar torneos mixtos/,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Cambalares es el equipo de fútbol mixto más grande de toda la historia/),
    ).toBeInTheDocument()
  })

  it('renders the fusion composition with an accessible name and decorative signs', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const fusion = screen.getByRole('group', {
      name: 'Cambalache más Solares da origen a Cambalares.',
    })

    const alternativeTexts = within(fusion)
      .getAllByRole('img')
      .map((image) => image.getAttribute('alt'))
    expect(alternativeTexts).toEqual([
      cambalache.crest.alt,
      currentCrestImage.alt,
      cambalares.crest.alt,
    ])

    for (const symbol of ['+', '=']) {
      const sign = within(fusion).getByText(symbol)
      expect(sign).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('renders the Cambalares photos in the manifest order', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const gallery = screen.getByRole('group', { name: 'Fotografías de Cambalares' })
    const alternativeTexts = within(gallery)
      .getAllByRole('img')
      .map((image) => image.getAttribute('alt'))
    expect(alternativeTexts).toEqual(cambalares.teamPhotos.map((photo) => photo.alt))
  })

  it('renders every image with a non-empty accessible name', () => {
    renderWithProviders(<WomenAndMixedPage />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      expect(image).toHaveAccessibleName()
    }
  })
})
