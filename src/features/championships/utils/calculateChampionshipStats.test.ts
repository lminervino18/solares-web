import { describe, expect, it } from 'vitest'

import type { Match } from '../types/championships'
import { calculateChampionshipStats } from './calculateChampionshipStats'

function match(partial: Partial<Match>): Match {
  return {
    id: 'm',
    championshipId: 'c',
    format: 'f8',
    sourceOrder: 0,
    opponent: 'Rival',
    outcome: 'win',
    scorers: [],
    isFinal: false,
    ...partial,
  }
}

describe('calculateChampionshipStats', () => {
  it('derives stats where played === won + drawn + lost', () => {
    const stats = calculateChampionshipStats([
      match({ outcome: 'win', goalsFor: 3, goalsAgainst: 1 }),
      match({ outcome: 'draw', goalsFor: 2, goalsAgainst: 2 }),
      match({ outcome: 'loss', goalsFor: 0, goalsAgainst: 1 }),
    ])
    expect(stats.played).toBe(stats.won + stats.drawn + stats.lost)
    expect(stats).toMatchObject({
      played: 3,
      won: 1,
      drawn: 1,
      lost: 1,
      goalsFor: 5,
      goalsAgainst: 4,
    })
    expect(stats.goalDifference).toBe(stats.goalsFor - stats.goalsAgainst)
  })

  it('ignores pending and cancelled matches', () => {
    const stats = calculateChampionshipStats([
      match({ outcome: 'win', goalsFor: 2, goalsAgainst: 0 }),
      match({ outcome: 'pending' }),
      match({ outcome: 'cancelled' }),
    ])
    expect(stats.played).toBe(1)
  })

  it('ignores decided matches with missing goals', () => {
    const stats = calculateChampionshipStats([match({ outcome: 'win' })])
    expect(stats.played).toBe(0)
  })

  it('returns zeros for no matches', () => {
    expect(calculateChampionshipStats([])).toMatchObject({ played: 0, goalDifference: 0 })
  })
})
