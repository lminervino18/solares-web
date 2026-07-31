import { describe, expect, it } from 'vitest'

import { goalFixtures, makeGoal } from '../test/goalFixtures'
import { ALL_FILTER } from '../selectors/selectFilteredGoals'
import { selectGoalScorerOptions } from '../selectors/selectGoalScorerOptions'
import { compareGoals, compareGoalCompetitions } from './compareGoalCompetitions'
import { createScorerSearch, normalizeGoalSearch } from './normalizeGoalSearch'
import { buildGoalDownloadName, buildGoalShareUrl } from './buildGoalShareUrl'
import { formatGoalDuration } from './formatGoalDuration'
import { parseGoalUrlState } from './parseGoalUrlState'

describe('compareGoalCompetitions', () => {
  it('orders official competitions newest first', () => {
    const names = [
      makeGoal({ competitionName: 'Apertura 2022' }).competition,
      makeGoal({ competitionName: 'Clausura 2025' }).competition,
      makeGoal({ competitionName: 'Apertura 2026' }).competition,
      makeGoal({ competitionName: 'Apertura 2025' }).competition,
    ]
      .sort(compareGoalCompetitions)
      .map((competition) => competition.name)

    expect(names).toEqual(['Apertura 2026', 'Clausura 2025', 'Apertura 2025', 'Apertura 2022'])
  })

  it('places friendlies and preseason after official competitions', () => {
    const names = [
      makeGoal({ competitionName: 'Pretemporada 2026', competitionType: 'preseason' }).competition,
      makeGoal({ competitionName: 'Amistoso 2024', competitionType: 'friendly' }).competition,
      makeGoal({ competitionName: 'Apertura 2022' }).competition,
    ]
      .sort(compareGoalCompetitions)
      .map((competition) => competition.name)

    expect(names).toEqual(['Apertura 2022', 'Amistoso 2024', 'Pretemporada 2026'])
  })
})

describe('compareGoals', () => {
  it('breaks ties inside a competition with the source timestamp, newest first', () => {
    const older = makeGoal({ id: 'older', createdAt: '2026-07-23T10:00:00.000Z' })
    const newer = makeGoal({ id: 'newer', createdAt: '2026-07-30T10:00:00.000Z' })
    expect([older, newer].sort(compareGoals).map((goal) => goal.id)).toEqual(['newer', 'older'])
  })

  it('does not let a timestamp override the competition chronology', () => {
    const oldCompetitionNewFile = makeGoal({
      id: 'old-competition',
      competitionName: 'Apertura 2022',
      createdAt: '2026-07-30T10:00:00.000Z',
    })
    const newCompetitionOldFile = makeGoal({
      id: 'new-competition',
      competitionName: 'Apertura 2026',
      createdAt: '2026-07-23T10:00:00.000Z',
    })
    expect(
      [oldCompetitionNewFile, newCompetitionOldFile].sort(compareGoals).map((g) => g.id),
    ).toEqual(['new-competition', 'old-competition'])
  })
})

describe('normalizeGoalSearch', () => {
  it('drops accents and case', () => {
    expect(normalizeGoalSearch('  Santiago  PEÑOÑORI ')).toBe('santiago penonori')
  })
})

describe('createScorerSearch', () => {
  const options = selectGoalScorerOptions(goalFixtures)
  const search = createScorerSearch(options)

  it('returns every option for an empty query', () => {
    expect(search('')).toHaveLength(options.length)
  })

  it('finds a scorer by first name', () => {
    expect(search('Lorenzo')[0]?.name).toBe('Lorenzo Minervino')
  })

  it('tolerates a typo', () => {
    expect(search('Lrorenzo').map((option) => option.name)).toContain('Lorenzo Minervino')
  })

  it('finds a scorer by last name', () => {
    expect(search('minervino')[0]?.name).toBe('Lorenzo Minervino')
  })

  it('ignores case', () => {
    expect(search('LORENZO')[0]?.name).toBe('Lorenzo Minervino')
  })

  it('matches an accented name typed without accents', () => {
    expect(search('penonori').map((option) => option.name)).toContain('Santiago Peñoñori')
  })

  it('ranks an exact match first', () => {
    expect(search('Lucas Iriarte')[0]?.name).toBe('Lucas Iriarte')
  })

  it('returns nothing for an unrelated query', () => {
    expect(search('zzzzqqqq')).toHaveLength(0)
  })
})

describe('buildGoalShareUrl', () => {
  const goal = makeGoal({ id: 'f8-abc', format: 'f8' })

  it('always points at the goals page', () => {
    const url = buildGoalShareUrl(
      goal,
      { competitionId: ALL_FILTER, scorerId: ALL_FILTER },
      'https://x.test',
    )
    expect(url).toBe('https://x.test/goles?gol=f8-abc')
  })

  it('omits the format for F8 and writes it for F5', () => {
    const f5Goal = makeGoal({ id: 'f5-abc', format: 'f5' })
    const url = buildGoalShareUrl(
      f5Goal,
      { competitionId: ALL_FILTER, scorerId: ALL_FILTER },
      'https://x.test',
    )
    expect(url).toContain('modalidad=f5')
  })

  it('keeps the active filters as context', () => {
    const url = buildGoalShareUrl(
      goal,
      { competitionId: 'f8-apertura-2026', scorerId: 'lorenzo-minervino' },
      'https://x.test/',
    )
    expect(url).toContain('torneo=apertura-2026')
    expect(url).toContain('jugador=lorenzo-minervino')
  })
})

describe('buildGoalDownloadName', () => {
  it('builds a readable name without the source file number', () => {
    expect(buildGoalDownloadName(makeGoal())).toBe('solares-f8-apertura-2026-lorenzo-minervino.mp4')
  })
})

describe('formatGoalDuration', () => {
  it('formats seconds as m:ss', () => {
    expect(formatGoalDuration(9.4)).toBe('0:09')
    expect(formatGoalDuration(75)).toBe('1:15')
  })

  it('never reports a clip as having no length', () => {
    expect(formatGoalDuration(0.2)).toBe('0:01')
  })

  it('returns nothing when the duration is unknown', () => {
    expect(formatGoalDuration(undefined)).toBeUndefined()
  })
})

describe('parseGoalUrlState', () => {
  it('defaults to F8 with no filters', () => {
    const state = parseGoalUrlState(goalFixtures, new URLSearchParams())
    expect(state.format).toBe('f8')
    expect(state.competitionId).toBe(ALL_FILTER)
    expect(state.goalId).toBeUndefined()
  })

  it('falls back to F8 for an invalid format', () => {
    expect(parseGoalUrlState(goalFixtures, new URLSearchParams('modalidad=f7')).format).toBe('f8')
  })

  it('lets a shared goal decide the format', () => {
    const state = parseGoalUrlState(goalFixtures, new URLSearchParams('gol=f5-a1'))
    expect(state.format).toBe('f5')
    expect(state.goalId).toBe('f5-a1')
  })

  it('drops only the filter that would hide the shared goal', () => {
    const state = parseGoalUrlState(
      goalFixtures,
      new URLSearchParams('gol=f8-b1&torneo=apertura-2026&jugador=geronimo-heller'),
    )
    expect(state.goalId).toBe('f8-b1')
    expect(state.competitionId).toBe(ALL_FILTER)
    expect(state.scorerId).toBe('geronimo-heller')
    expect(state.needsCleanup).toBe(true)
  })

  it('reports an unknown goal instead of breaking', () => {
    const state = parseGoalUrlState(goalFixtures, new URLSearchParams('gol=nope'))
    expect(state.missingGoal).toBe(true)
    expect(state.goalId).toBeUndefined()
    // The parameter is not cleaned up here: removing it would take the notice
    // with it. Filter and navigation actions drop it instead.
    expect(state.needsCleanup).toBe(false)
  })

  it('ignores a filter that does not exist in the active format', () => {
    const state = parseGoalUrlState(goalFixtures, new URLSearchParams('torneo=pretemporada-2026'))
    expect(state.competitionId).toBe(ALL_FILTER)
  })
})
