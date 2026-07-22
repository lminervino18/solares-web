import { describe, expect, it } from 'vitest'

import { mapScorers } from './mapScorers'
import type { RawMatch } from './mapMatches'

function rawMatch(scorersRaw: string): RawMatch {
  return {
    championshipName: 'Apertura 2022',
    sourceOrder: 0,
    opponent: 'Rival',
    outcome: 'win',
    isFinal: false,
    scorersRaw,
  }
}

describe('mapScorers', () => {
  it('aggregates goals per player and sorts descending', () => {
    const scorers = mapScorers(
      [
        rawMatch('Lorenzo Minervino,Lautaro Mariani,Lorenzo Minervino'),
        rawMatch('Lorenzo Minervino'),
      ],
      'f8-apertura-2022',
      'f8',
    )
    expect(scorers[0]).toMatchObject({ playerName: 'Lorenzo Minervino', goals: 3 })
    expect(scorers[1]).toMatchObject({ playerName: 'Lautaro Mariani', goals: 1 })
  })

  it('excludes own goals ("En Contra")', () => {
    const scorers = mapScorers(
      [rawMatch('En Contra,Lorenzo Minervino,En Contra')],
      'f8-apertura-2022',
      'f8',
    )
    expect(scorers).toHaveLength(1)
    expect(scorers[0]).toMatchObject({ playerName: 'Lorenzo Minervino', goals: 1 })
  })

  it('breaks ties alphabetically for a deterministic order', () => {
    const scorers = mapScorers([rawMatch('Zulema,Ana')], 'f8-apertura-2022', 'f8')
    expect(scorers.map((s) => s.playerName)).toEqual(['Ana', 'Zulema'])
  })

  it('returns an empty list when there are no scorers', () => {
    expect(mapScorers([rawMatch('')], 'f8-apertura-2022', 'f8')).toHaveLength(0)
  })
})
