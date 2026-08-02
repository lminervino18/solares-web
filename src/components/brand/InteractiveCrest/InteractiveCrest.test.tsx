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

  it('gives each size a different frame', () => {
    const { container: small } = render(<InteractiveCrest crest={currentCrestImage} size="sm" />)
    const { container: large } = render(<InteractiveCrest crest={currentCrestImage} size="lg" />)
    expect(small.firstElementChild?.className).not.toBe(large.firstElementChild?.className)
  })

  it('scales the frame down for narrow viewports', () => {
    const { container } = render(<InteractiveCrest crest={currentCrestImage} size="lg" />)
    const frame = container.firstElementChild?.className ?? ''
    // A phone-first width plus a wider step: a single desktop-sized frame takes
    // most of a phone screen and pushes the surrounding copy below the fold.
    expect(frame).toMatch(/(^|\s)max-w-\[[\d.]+rem\]/)
    expect(frame).toMatch(/\slg:max-w-\[[\d.]+rem\]/)
  })

  it('fits the crest in a square frame of an explicit width when asked', () => {
    const { container } = render(
      <InteractiveCrest crest={currentCrestImage} size="md" shape="square" />,
    )
    const frame = container.firstElementChild?.className ?? ''
    // The width must be explicit, never `w-full`: the box would otherwise derive
    // its size from the image, which measures zero until the PNG arrives.
    expect(frame).toMatch(/(^|\s)w-\[[\d.]+rem\]/)
    expect(frame).not.toMatch(/(^|\s)w-full(\s|$)/)
    expect(container.querySelector('.aspect-square')).not.toBeNull()
    expect(container.querySelector('img')?.className).toContain('object-contain')
  })
})
