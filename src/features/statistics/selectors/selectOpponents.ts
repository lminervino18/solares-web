import type { Championship } from '@/features/championships/types/championships'
import { slugify } from '@/features/championships/utils/normalizeCellValue'
import { canonicalOpponentName } from '../data/opponent-aliases'
import type { OpponentStatistics } from '../types/statistics'
import { collectPlayedMatches } from '../utils/collectMatches'

type Accumulator = {
  name: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  lastDate?: string
}

/**
 * Aggregates results against each opponent, ordered by matches played (then
 * goal difference). Opponent names are resolved through explicit aliases.
 */
export function selectOpponents(
  championships: readonly Championship[],
): readonly OpponentStatistics[] {
  const opponents = new Map<string, Accumulator>()

  for (const { match } of collectPlayedMatches(championships)) {
    const name = canonicalOpponentName(match.opponent)
    const key = name.toLowerCase()
    const entry = opponents.get(key) ?? {
      name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    }
    entry.played += 1
    if (match.outcome === 'win') entry.won += 1
    else if (match.outcome === 'draw') entry.drawn += 1
    else if (match.outcome === 'loss') entry.lost += 1
    entry.goalsFor += match.goalsFor ?? 0
    entry.goalsAgainst += match.goalsAgainst ?? 0
    if (match.date && (!entry.lastDate || match.date > entry.lastDate)) {
      entry.lastDate = match.date
    }
    opponents.set(key, entry)
  }

  return [...opponents.values()]
    .map((entry) => ({
      opponentId: slugify(entry.name),
      opponentName: entry.name,
      played: entry.played,
      won: entry.won,
      drawn: entry.drawn,
      lost: entry.lost,
      goalsFor: entry.goalsFor,
      goalsAgainst: entry.goalsAgainst,
      goalDifference: entry.goalsFor - entry.goalsAgainst,
      ...(entry.lastDate ? { lastDate: entry.lastDate } : {}),
    }))
    .sort(
      (a, b) =>
        b.played - a.played ||
        b.goalDifference - a.goalDifference ||
        a.opponentName.localeCompare(b.opponentName, 'es'),
    )
}
