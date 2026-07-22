import { describe, expect, it } from 'vitest'

import { loadChampionshipsSnapshot } from '@/features/championships/data/championshipsSnapshot'
import type { ChampionshipsByFormat } from '@/features/championships/types/championships'
import { buildStatisticsViewModel } from './buildStatisticsViewModel'
import { makeChampionship, makeMatch } from './testFixtures'

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

  it('counts unpublished championships in match stats but not in tournaments or titles', () => {
    const fixture: ChampionshipsByFormat = {
      f8: [],
      f5: [
        makeChampionship({
          format: 'f5',
          published: true,
          honorType: 'gold-champion',
          stats: {
            played: 1,
            won: 1,
            drawn: 0,
            lost: 0,
            goalsFor: 3,
            goalsAgainst: 0,
            goalDifference: 3,
          },
          matches: [
            makeMatch({
              format: 'f5',
              goalsFor: 3,
              goalsAgainst: 0,
              scorers: [{ name: 'Ana', goals: 3 }],
            }),
          ],
        }),
        makeChampionship({
          id: 'f5-verano',
          format: 'f5',
          name: 'Verano 2026',
          published: false,
          matches: [
            makeMatch({
              format: 'f5',
              goalsFor: 2,
              goalsAgainst: 1,
              scorers: [{ name: 'Ana', goals: 2 }],
            }),
          ],
        }),
      ],
    }

    const vm = buildStatisticsViewModel(fixture, 'f5')
    expect(vm.general.matchesPlayed).toBe(2)
    expect(vm.general.goalsFor).toBe(5)
    expect(vm.general.tournamentsPlayed).toBe(1)
    expect(vm.general.titles).toBe(1)
    expect(vm.tournaments).toHaveLength(1)
    expect(vm.scorers[0]).toMatchObject({ playerName: 'Ana', goals: 5 })
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
