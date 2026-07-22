import { describe, expect, it } from 'vitest'

import { classifyPhase, isKnockoutPhase } from './classifyPhase'

describe('classifyPhase', () => {
  it('classifies group/regular stages', () => {
    expect(classifyPhase('Regular')).toBe('group')
    expect(classifyPhase('Fase de grupos')).toBe('group')
  })

  it('classifies knockout stages, matching semifinal before final', () => {
    expect(classifyPhase('Octavos')).toBe('round-of-16')
    expect(classifyPhase('Cuartos')).toBe('quarterfinal')
    expect(classifyPhase('Semifinal')).toBe('semifinal')
    expect(classifyPhase('Final')).toBe('final')
  })

  it('returns unknown for unrecognized or missing stages', () => {
    expect(classifyPhase(undefined)).toBe('unknown')
    expect(classifyPhase('Amistoso')).toBe('unknown')
  })

  it('identifies knockout phases', () => {
    expect(isKnockoutPhase('final')).toBe(true)
    expect(isKnockoutPhase('semifinal')).toBe(true)
    expect(isKnockoutPhase('group')).toBe(false)
    expect(isKnockoutPhase('unknown')).toBe(false)
  })
})
