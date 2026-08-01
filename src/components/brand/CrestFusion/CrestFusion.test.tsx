import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

import { currentCrestImage } from '@/data/brand'
import { womenAndMixedMedia } from '@/data/womenAndMixed'
import { CrestFusion } from './CrestFusion'

const label = 'Cambalache más Solares da origen a Cambalares.'

function renderFusion() {
  return render(
    <CrestFusion
      left={{ crest: womenAndMixedMedia.cambalache.crest }}
      right={{ crest: currentCrestImage, zoom: 'sm' }}
      result={{ crest: womenAndMixedMedia.cambalares.crest }}
      label={label}
    />,
  )
}

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

describe('CrestFusion', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('names the whole composition and keeps the signs decorative', () => {
    renderFusion()
    const fusion = screen.getByRole('group', { name: label })
    expect(within(fusion).getByText('+')).toHaveAttribute('aria-hidden', 'true')
    expect(within(fusion).getByText('=')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the three crests in the order of the equation', () => {
    renderFusion()
    const alternativeTexts = screen.getAllByRole('img').map((image) => image.getAttribute('alt'))
    expect(alternativeTexts).toEqual([
      womenAndMixedMedia.cambalache.crest.alt,
      currentCrestImage.alt,
      womenAndMixedMedia.cambalares.crest.alt,
    ])
  })

  it('shows the three crests right away when the user prefers reduced motion', () => {
    mockReducedMotion(true)
    renderFusion()
    const fusion = screen.getByRole('group', { name: label })

    expect(within(fusion).getAllByRole('img')).toHaveLength(3)
    for (const child of fusion.children) {
      expect(child.getAttribute('style')).toBeNull()
    }
  })

  it('staggers the entrance when motion is allowed', () => {
    mockReducedMotion(false)
    renderFusion()
    const fusion = screen.getByRole('group', { name: label })

    const animated = [...fusion.children].filter((child) => child.getAttribute('style') !== null)
    expect(animated).toHaveLength(fusion.children.length)
  })
})
