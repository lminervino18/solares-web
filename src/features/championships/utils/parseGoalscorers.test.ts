import { describe, expect, it } from 'vitest'

import { parseGoalscorers } from './parseGoalscorers'

describe('parseGoalscorers', () => {
  it('counts goals per player and keeps first-appearance order', () => {
    const scorers = parseGoalscorers('Lucas Iriarte,Agustin Di Yacovo,Lucas Iriarte')
    expect(scorers).toEqual([
      { name: 'Lucas Iriarte', goals: 2 },
      { name: 'Agustin Di Yacovo', goals: 1 },
    ])
  })

  it('excludes own goals', () => {
    const scorers = parseGoalscorers('En Contra,Lorenzo Minervino,En Contra')
    expect(scorers).toEqual([{ name: 'Lorenzo Minervino', goals: 1 }])
  })

  it('returns an empty list for an empty cell', () => {
    expect(parseGoalscorers(undefined)).toEqual([])
    expect(parseGoalscorers('')).toEqual([])
  })
})
