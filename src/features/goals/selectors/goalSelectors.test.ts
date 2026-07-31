import { describe, expect, it } from 'vitest'

import { goalFixtures, makeGoal } from '../test/goalFixtures'
import { ALL_FILTER, selectFilteredGoals, selectGoalsByChampionship } from './selectFilteredGoals'
import { selectGoalCompetitionOptions } from './selectGoalCompetitionOptions'
import { selectGoalScorerOptions } from './selectGoalScorerOptions'
import { selectAdjacentGoals } from './selectAdjacentGoals'
import { selectRandomGoal } from './selectRandomGoal'

const f8 = goalFixtures.filter((goal) => goal.format === 'f8')

describe('selectFilteredGoals', () => {
  it('keeps only the active format', () => {
    const result = selectFilteredGoals(goalFixtures, {
      format: 'f8',
      competitionId: ALL_FILTER,
      scorerId: ALL_FILTER,
    })
    expect(result).toHaveLength(4)
    expect(result.every((goal) => goal.format === 'f8')).toBe(true)
  })

  it('filters by competition', () => {
    const result = selectFilteredGoals(goalFixtures, {
      format: 'f8',
      competitionId: 'f8-apertura-2026',
      scorerId: ALL_FILTER,
    })
    expect(result.map((goal) => goal.id)).toEqual(['f8-a1', 'f8-a2'])
  })

  it('filters by scorer', () => {
    const result = selectFilteredGoals(goalFixtures, {
      format: 'f8',
      competitionId: ALL_FILTER,
      scorerId: 'geronimo-heller',
    })
    expect(result.map((goal) => goal.id)).toEqual(['f8-b1'])
  })

  it('combines both filters with AND', () => {
    const result = selectFilteredGoals(goalFixtures, {
      format: 'f8',
      competitionId: 'f8-apertura-2026',
      scorerId: 'geronimo-heller',
    })
    expect(result).toHaveLength(0)
  })

  it('never mixes formats sharing a competition name', () => {
    const result = selectFilteredGoals(goalFixtures, {
      format: 'f5',
      competitionId: 'f5-apertura-2026',
      scorerId: ALL_FILTER,
    })
    expect(result.map((goal) => goal.id)).toEqual(['f5-a1'])
  })
})

describe('selectGoalsByChampionship', () => {
  it('matches on format and championship id, not on the display name', () => {
    expect(selectGoalsByChampionship(goalFixtures, 'f8', 'f8-apertura-2026')).toHaveLength(2)
    expect(selectGoalsByChampionship(goalFixtures, 'f5', 'f8-apertura-2026')).toHaveLength(0)
  })

  it('returns nothing for a friendly, which belongs to no championship', () => {
    expect(selectGoalsByChampionship(goalFixtures, 'f8', 'f8-amistoso-2024')).toHaveLength(0)
  })
})

describe('selectGoalCompetitionOptions', () => {
  it('lists official competitions first, then friendlies and preseason', () => {
    const options = selectGoalCompetitionOptions(goalFixtures)
    expect(options.map((option) => option.name)).toEqual([
      'Apertura 2026',
      'Apertura 2026',
      'Clausura 2025',
      'Amistoso 2024',
      'Pretemporada 2026',
    ])
  })

  it('counts the goals of each competition', () => {
    const options = selectGoalCompetitionOptions(f8)
    expect(options.find((option) => option.id === 'f8-apertura-2026')?.goals).toBe(2)
  })

  it('omits competitions without goals', () => {
    const options = selectGoalCompetitionOptions([])
    expect(options).toHaveLength(0)
  })
})

describe('selectGoalScorerOptions', () => {
  it('orders by goal count and then alphabetically', () => {
    const options = selectGoalScorerOptions(f8)
    expect(options.map((option) => option.name)).toEqual([
      'Lorenzo Minervino',
      'Ary Martinez',
      'Geronimo Heller',
    ])
    expect(options[0]?.goals).toBe(2)
  })
})

describe('selectAdjacentGoals', () => {
  it('resolves the position and both neighbours', () => {
    const result = selectAdjacentGoals(f8, 'f8-a2')
    expect(result.index).toBe(1)
    expect(result.total).toBe(4)
    expect(result.previous?.id).toBe('f8-a1')
    expect(result.next?.id).toBe('f8-b1')
  })

  it('closes both ends instead of wrapping around', () => {
    expect(selectAdjacentGoals(f8, 'f8-a1').previous).toBeUndefined()
    expect(selectAdjacentGoals(f8, 'f8-c1').next).toBeUndefined()
  })

  it('reports an unknown goal without throwing', () => {
    expect(selectAdjacentGoals(f8, 'missing').index).toBe(-1)
  })
})

describe('selectRandomGoal', () => {
  it('picks from the filtered collection only', () => {
    const picked = selectRandomGoal(f8, undefined, () => 0)
    expect(picked?.id).toBe('f8-a1')
  })

  it('avoids repeating the open goal when another one exists', () => {
    const picked = selectRandomGoal(f8, 'f8-a1', () => 0)
    expect(picked?.id).toBe('f8-a2')
  })

  it('returns the only result when there is a single one', () => {
    const single = [makeGoal({ id: 'only' })]
    expect(selectRandomGoal(single, 'only', () => 0.99)?.id).toBe('only')
  })

  it('returns nothing when there are no results', () => {
    expect(selectRandomGoal([], undefined, () => 0)).toBeUndefined()
  })

  it('stays inside bounds when random returns its maximum', () => {
    expect(selectRandomGoal(f8, undefined, () => 0.999999)).toBeDefined()
  })
})
