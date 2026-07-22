import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { useStatisticsScope } from './useStatisticsScope'

function wrapper(entries: string[]) {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={entries}>{children}</MemoryRouter>
  )
}

describe('useStatisticsScope', () => {
  it('defaults to f8', () => {
    const { result } = renderHook(() => useStatisticsScope(), {
      wrapper: wrapper(['/estadisticas']),
    })
    expect(result.current.scope).toBe('f8')
  })

  it('reads f5 from modalidad', () => {
    const { result } = renderHook(() => useStatisticsScope(), {
      wrapper: wrapper(['/estadisticas?modalidad=f5']),
    })
    expect(result.current.scope).toBe('f5')
  })

  it('falls back to f8 for an invalid modalidad', () => {
    const { result } = renderHook(() => useStatisticsScope(), {
      wrapper: wrapper(['/estadisticas?modalidad=otra']),
    })
    expect(result.current.scope).toBe('f8')
  })

  it('updates the scope', () => {
    const { result } = renderHook(() => useStatisticsScope(), {
      wrapper: wrapper(['/estadisticas']),
    })
    act(() => result.current.setScope('f5'))
    expect(result.current.scope).toBe('f5')
  })
})
