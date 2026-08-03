import type { StreakRecord, StreakType } from '../types/statistics'
import { collectPlayedMatches, type MatchWithContext } from '../utils/collectMatches'
import type { Championship } from '@/features/championships/types/championships'

type Predicate = (entry: MatchWithContext) => boolean

const PREDICATES: Record<StreakType, Predicate> = {
  wins: ({ match }) => match.outcome === 'win',
  losses: ({ match }) => match.outcome === 'loss',
  unbeaten: ({ match }) => match.outcome === 'win' || match.outcome === 'draw',
  winless: ({ match }) => match.outcome === 'draw' || match.outcome === 'loss',
  scoring: ({ match }) => (match.goalsFor ?? 0) > 0,
  'clean-sheets': ({ match }) => match.goalsAgainst === 0,
}

function longestStreak(
  entries: readonly MatchWithContext[],
  type: StreakType,
): StreakRecord | undefined {
  const predicate = PREDICATES[type]
  let best: MatchWithContext[] = []
  let current: MatchWithContext[] = []

  for (const entry of entries) {
    if (predicate(entry)) {
      current.push(entry)
      if (current.length > best.length) best = current
    } else {
      current = []
    }
  }

  if (best.length === 0) return undefined
  const first = best[0]
  const last = best[best.length - 1]
  if (!first || !last) return undefined

  return {
    type,
    length: best.length,
    firstOpponent: first.match.opponent,
    lastOpponent: last.match.opponent,
    matchIds: best.map((entry) => entry.match.id),
    ...(first.match.date ? { startDate: first.match.date } : {}),
    ...(last.match.date ? { endDate: last.match.date } : {}),
  }
}

export function selectStreaks(championships: readonly Championship[]): readonly StreakRecord[] {
  const entries = collectPlayedMatches(championships)
  const types: readonly StreakType[] = [
    'wins',
    'unbeaten',
    'losses',
    'winless',
    'scoring',
    'clean-sheets',
  ]
  return types
    .map((type) => longestStreak(entries, type))
    .filter((streak): streak is StreakRecord => streak !== undefined)
}
