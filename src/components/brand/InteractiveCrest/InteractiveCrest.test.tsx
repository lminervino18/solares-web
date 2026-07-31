import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { currentCrestImage } from '@/data/brand'
import { womenAndMixedMedia } from '@/data/womenAndMixed'
import { InteractiveCrest } from './InteractiveCrest'

const crests = [
  { name: 'Solares', crest: currentCrestImage },
  { name: 'Cambalache', crest: womenAndMixedMedia.cambalache.crest },
  { name: 'Cambalares', crest: womenAndMixedMedia.cambalares.crest },
]

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('prefers-reduced-motion') ? matches : false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )
}

describe('InteractiveCrest', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(crests)('renders the $name crest with its alternative text', ({ crest }) => {
    render(<InteractiveCrest crest={crest} />)
    expect(screen.getByRole('img', { name: crest.alt })).toBeInTheDocument()
  })

  it('exposes the crest once and keeps the reverse face decorative', () => {
    render(<InteractiveCrest crest={currentCrestImage} />)
    expect(screen.getAllByRole('img', { name: currentCrestImage.alt })).toHaveLength(1)
    expect(screen.getAllByRole('img')).toHaveLength(1)
  })

  it('keeps the perspective wrapper when motion is allowed', () => {
    mockReducedMotion(false)
    const { container } = render(<InteractiveCrest crest={currentCrestImage} />)
    expect(container.querySelector('[class*="perspective"]')).not.toBeNull()
  })

  it('renders a static crest when the user prefers reduced motion', () => {
    mockReducedMotion(true)
    const { container } = render(<InteractiveCrest crest={currentCrestImage} />)
    expect(container.querySelector('[class*="perspective"]')).toBeNull()
    expect(screen.getByRole('img', { name: currentCrestImage.alt })).toBeInTheDocument()
  })

  it('applies the requested size', () => {
    const { container } = render(<InteractiveCrest crest={currentCrestImage} size="sm" />)
    expect(container.querySelector('.max-w-\\[9rem\\]')).not.toBeNull()
  })
})
