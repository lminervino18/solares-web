import { describe, expect, it } from 'vitest'

import { mapChampionshipHonor } from './mapChampionshipHonor'

describe('mapChampionshipHonor', () => {
  it('maps an unqualified champion to gold', () => {
    expect(mapChampionshipHonor('Campeón')).toEqual({
      honorType: 'gold-champion',
      trophyTier: 'gold',
    })
  })

  it('maps a silver champion', () => {
    expect(mapChampionshipHonor('Campeón Plata')).toEqual({
      honorType: 'silver-champion',
      trophyTier: 'silver',
    })
  })

  it('maps finalists without a trophy', () => {
    expect(mapChampionshipHonor('Finalista')).toEqual({
      honorType: 'gold-runner-up',
      trophyTier: 'none',
    })
    expect(mapChampionshipHonor('Finalista de Plata')).toEqual({
      honorType: 'silver-runner-up',
      trophyTier: 'none',
    })
  })

  it('maps semifinalista even though it contains "finalista"', () => {
    expect(mapChampionshipHonor('Semifinalista')).toEqual({
      honorType: 'semifinalist',
      trophyTier: 'none',
    })
  })

  it('returns unknown for an empty result', () => {
    expect(mapChampionshipHonor(undefined)).toEqual({ honorType: 'unknown', trophyTier: 'none' })
  })
})
