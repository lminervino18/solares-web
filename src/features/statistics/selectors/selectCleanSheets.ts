import type { Championship } from '@/features/championships/types/championships'
import type { CleanSheetStatistics } from '../types/statistics'
import { collectPlayedMatches } from '../utils/collectMatches'
import { selectStreaks } from './selectStreaks'

/**
 * Computes clean sheet insights: total, rate, the tournament with the most and
 * the longest consecutive clean-sheet run.
 */
export function selectCleanSheets(championships: readonly Championship[]): CleanSheetStatistics {
  const played = collectPlayedMatches(championships)
  const total = played.filter((entry) => entry.match.goalsAgainst === 0).length

  const perTournament = new Map<string, { name: string; slug: string; count: number }>()
  for (const { match, championship } of played) {
    if (match.goalsAgainst !== 0) continue
    const entry = perTournament.get(championship.id) ?? {
      name: championship.name,
      slug: championship.slug,
      count: 0,
    }
    entry.count += 1
    perTournament.set(championship.id, entry)
  }
  const bestTournament = [...perTournament.values()].sort((a, b) => b.count - a.count)[0]

  const longestStreak =
    selectStreaks(championships).find((streak) => streak.type === 'clean-sheets')?.length ?? 0

  return {
    total,
    longestStreak,
    ...(played.length > 0 ? { rate: total / played.length } : {}),
    ...(bestTournament ? { bestTournament } : {}),
  }
}
