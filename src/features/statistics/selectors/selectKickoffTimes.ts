import type { Championship } from '@/features/championships/types/championships'
import type { KickoffTimeStatistics } from '../types/statistics'
import { collectPlayedMatches } from '../utils/collectMatches'
import { MIN_MATCHES_FOR_RATE_RANKING } from '../types/statistics'

export function selectKickoffTimes(
  championships: readonly Championship[],
): readonly KickoffTimeStatistics[] {
  const times = new Map<string, { matches: number; wins: number }>()
  let total = 0

  for (const { match } of collectPlayedMatches(championships)) {
    if (!match.time) continue
    total += 1
    const entry = times.get(match.time) ?? { matches: 0, wins: 0 }
    entry.matches += 1
    if (match.outcome === 'win') entry.wins += 1
    times.set(match.time, entry)
  }

  return [...times.entries()]
    .map(([time, entry]) => ({
      time,
      matches: entry.matches,
      wins: entry.wins,
      share: total > 0 ? entry.matches / total : 0,
      ...(entry.matches >= MIN_MATCHES_FOR_RATE_RANKING
        ? { winRate: entry.wins / entry.matches }
        : {}),
    }))
    .sort((a, b) => a.time.localeCompare(b.time))
}
