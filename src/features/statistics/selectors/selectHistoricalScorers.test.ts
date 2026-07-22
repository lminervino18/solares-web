import { describe, expect, it } from 'vitest'

import { selectHistoricalScorers, selectKnockoutScorers } from './selectHistoricalScorers'
import { makeChampionship, makeMatch } from './testFixtures'

describe('selectHistoricalScorers', () => {
  it('aggregates goals across matches and tournaments with competitive ranking', () => {
    const scorers = selectHistoricalScorers([
      makeChampionship({
        id: 'c1',
        matches: [
          makeMatch({ scorers: [{ name: 'Ana', goals: 3 }] }),
          makeMatch({ scorers: [{ name: 'Beto', goals: 2 }] }),
        ],
      }),
      makeChampionship({
        id: 'c2',
        matches: [makeMatch({ scorers: [{ name: 'Cami', goals: 2 }] })],
      }),
    ])

    expect(scorers[0]).toMatchObject({
      playerName: 'Ana',
      goals: 3,
      rank: 1,
      tournamentsWithGoals: 1,
    })
    // Beto and Cami tie on 2 goals and share rank 2 (competitive ranking).
    expect(scorers[1]?.rank).toBe(2)
    expect(scorers[2]?.rank).toBe(2)
    expect(scorers.map((s) => s.playerName)).toEqual(['Ana', 'Beto', 'Cami'])
  })

  it('counts knockout goals only from knockout phases', () => {
    const scorers = selectHistoricalScorers([
      makeChampionship({
        matches: [
          makeMatch({ stage: 'Regular', scorers: [{ name: 'Ana', goals: 2 }] }),
          makeMatch({ stage: 'Final', scorers: [{ name: 'Ana', goals: 1 }] }),
        ],
      }),
    ])
    expect(scorers[0]).toMatchObject({ goals: 3, knockoutGoals: 1 })

    const knockout = selectKnockoutScorers(scorers)
    expect(knockout).toHaveLength(1)
    expect(knockout[0]).toMatchObject({ playerName: 'Ana', knockoutGoals: 1 })
  })

  it('returns an empty list when there are no scorers', () => {
    expect(selectHistoricalScorers([makeChampionship({ matches: [makeMatch()] })])).toHaveLength(0)
  })
})
