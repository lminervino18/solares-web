import { describe, expect, it } from 'vitest'

import { parseYouTubeUrl } from './parseYouTubeUrl'

describe('parseYouTubeUrl', () => {
  it('parses a watch URL with extra params', () => {
    const video = parseYouTubeUrl('https://www.youtube.com/watch?v=6EctDXbNgxs&t=3181s')
    expect(video?.videoId).toBe('6EctDXbNgxs')
    expect(video?.embedUrl).toBe('https://www.youtube-nocookie.com/embed/6EctDXbNgxs')
  })

  it('parses youtu.be, embed and shorts URLs', () => {
    expect(parseYouTubeUrl('https://youtu.be/6EctDXbNgxs')?.videoId).toBe('6EctDXbNgxs')
    expect(parseYouTubeUrl('https://www.youtube.com/embed/6EctDXbNgxs')?.videoId).toBe(
      '6EctDXbNgxs',
    )
    expect(parseYouTubeUrl('https://www.youtube.com/shorts/6EctDXbNgxs')?.videoId).toBe(
      '6EctDXbNgxs',
    )
  })

  it('accepts a bare 11-character video id', () => {
    expect(parseYouTubeUrl('6EctDXbNgxs')?.videoId).toBe('6EctDXbNgxs')
  })

  it('returns undefined for a plain title, not a URL', () => {
    expect(
      parseYouTubeUrl('Solares 8 Los Pitbulls del Botanico 2 (Partido Completo) - YouTube'),
    ).toBeUndefined()
  })

  it('returns undefined for empty or non-YouTube values', () => {
    expect(parseYouTubeUrl('')).toBeUndefined()
    expect(parseYouTubeUrl(null)).toBeUndefined()
    expect(parseYouTubeUrl('https://example.com/watch?v=abc')).toBeUndefined()
  })
})
