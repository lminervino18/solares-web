import { describe, expect, it } from 'vitest'

import { selectStreaks } from './selectStreaks'
import { makeChampionship, makeMatch } from './testFixtures'

function outcomes(outs: readonly ('win' | 'draw' | 'loss')[]) {
  return makeChampionship({
    sourceOrder: 0,
    matches: outs.map((outcome, index) =>
      makeMatch({
        outcome,
        goalsFor: outcome === 'loss' ? 0 : 2,
        goalsAgainst: outcome === 'win' ? 0 : outcome === 'draw' ? 2 : 1,
        sourceOrder: index,
        opponent: `R${index}`,
      }),
    ),
  })
}

describe('selectStreaks', () => {
  it('computes the longest win and unbeaten streaks', () => {
    const streaks = selectStreaks([outcomes(['win', 'win', 'win', 'draw', 'loss', 'win', 'win'])])
    const byType = Object.fromEntries(streaks.map((s) => [s.type, s.length]))
    expect(byType.wins).toBe(3)
    expect(byType.unbeaten).toBe(4)
    expect(byType.losses).toBe(1)
  })

  it('computes clean-sheet and scoring streaks', () => {
    const streaks = selectStreaks([outcomes(['win', 'win', 'draw', 'loss'])])
    const byType = Object.fromEntries(streaks.map((s) => [s.type, s.length]))
    // wins score 2-0 → clean sheets; draw is 2-2, loss is 0-1.
    expect(byType['clean-sheets']).toBe(2)
    expect(byType.scoring).toBe(3)
  })

  it('returns no streaks without matches', () => {
    expect(selectStreaks([makeChampionship()])).toHaveLength(0)
  })
})
