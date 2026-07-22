import { describe, expect, it } from 'vitest'

import { loadChampionshipsSnapshot } from '@/features/championships/data/championshipsSnapshot'
import { buildStatisticsViewModel } from './buildStatisticsViewModel'

const { data } = loadChampionshipsSnapshot()

describe('buildStatisticsViewModel (snapshot integration)', () => {
  it('keeps played === won + drawn + lost and DG === GF - GC per scope', () => {
    for (const scope of ['f8', 'f5'] as const) {
      const { general } = buildStatisticsViewModel(data, scope)
      expect(general.matchesPlayed).toBe(
        general.matchesWon + general.matchesDrawn + general.matchesLost,
      )
      expect(general.goalDifference).toBe(general.goalsFor - general.goalsAgainst)
    }
  })

  it('never mixes F8 and F5 data', () => {
    const f8 = buildStatisticsViewModel(data, 'f8')
    const f5 = buildStatisticsViewModel(data, 'f5')
    // F8 has more championships and matches than F5 in the snapshot; the totals
    // must differ, proving each scope is computed independently.
    expect(f8.general.matchesPlayed).not.toBe(f5.general.matchesPlayed)
    expect(f8.tournaments.every((t) => t.format === 'f8')).toBe(true)
    expect(f5.tournaments.every((t) => t.format === 'f5')).toBe(true)
  })

  it('counts titles as gold + silver + other', () => {
    const { general, achievements } = buildStatisticsViewModel(data, 'f8')
    expect(general.titles).toBe(
      achievements.goldTitles + achievements.silverTitles + achievements.otherTitles,
    )
  })

  it('ranks the historical scorers by goals', () => {
    const { scorers } = buildStatisticsViewModel(data, 'f8')
    expect(scorers.length).toBeGreaterThan(0)
    expect(scorers[0]?.rank).toBe(1)
    for (let i = 1; i < scorers.length; i += 1) {
      const current = scorers[i]
      const previous = scorers[i - 1]
      if (current && previous) expect(current.goals).toBeLessThanOrEqual(previous.goals)
    }
  })
})
