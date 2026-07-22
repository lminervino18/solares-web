import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { useChampionshipsUrlState } from './useChampionshipsUrlState'

function wrapper(initialEntries: string[]) {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  )
}

describe('useChampionshipsUrlState', () => {
  it('defaults to f8 for /campeonatos', () => {
    const { result } = renderHook(() => useChampionshipsUrlState(), {
      wrapper: wrapper(['/campeonatos']),
    })
    expect(result.current.format).toBe('f8')
  })

  it('reads f8 and f5 from the modalidad param', () => {
    expect(
      renderHook(() => useChampionshipsUrlState(), {
        wrapper: wrapper(['/campeonatos?modalidad=f8']),
      }).result.current.format,
    ).toBe('f8')
    expect(
      renderHook(() => useChampionshipsUrlState(), {
        wrapper: wrapper(['/campeonatos?modalidad=f5']),
      }).result.current.format,
    ).toBe('f5')
  })

  it('falls back to f8 for an invalid modalidad', () => {
    const { result } = renderHook(() => useChampionshipsUrlState(), {
      wrapper: wrapper(['/campeonatos?modalidad=otra-cosa']),
    })
    expect(result.current.format).toBe('f8')
  })

  it('reads the torneo slug', () => {
    const { result } = renderHook(() => useChampionshipsUrlState(), {
      wrapper: wrapper(['/campeonatos?modalidad=f5&torneo=apertura-2026']),
    })
    expect(result.current.torneoSlug).toBe('apertura-2026')
  })

  it('sets f5 in the URL and clears the torneo on format change', () => {
    const { result } = renderHook(() => useChampionshipsUrlState(), {
      wrapper: wrapper(['/campeonatos?torneo=clausura-2025']),
    })
    act(() => result.current.setFormat('f5'))
    expect(result.current.format).toBe('f5')
    expect(result.current.torneoSlug).toBeUndefined()
  })

  it('updates the torneo slug on selection', () => {
    const { result } = renderHook(() => useChampionshipsUrlState(), {
      wrapper: wrapper(['/campeonatos?modalidad=f5']),
    })
    act(() => result.current.setTorneo('clausura-2025'))
    expect(result.current.torneoSlug).toBe('clausura-2025')
    expect(result.current.format).toBe('f5')
  })
})
