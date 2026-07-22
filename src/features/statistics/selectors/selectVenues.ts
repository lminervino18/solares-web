import type { Championship } from '@/features/championships/types/championships'
import { slugify } from '@/features/championships/utils/normalizeCellValue'
import { canonicalVenueName } from '../data/venue-aliases'
import type { VenueStatistics } from '../types/statistics'
import { collectPlayedMatches } from '../utils/collectMatches'
import { MIN_MATCHES_FOR_RATE_RANKING } from '../types/statistics'

/**
 * Aggregates matches by venue, ordered by matches played. `share` is the venue's
 * fraction of all played matches. A win rate is only provided once the venue has
 * a meaningful sample ({@link MIN_MATCHES_FOR_RATE_RANKING}).
 */
export function selectVenues(championships: readonly Championship[]): readonly VenueStatistics[] {
  const venues = new Map<string, { name: string; matches: number; wins: number }>()
  let total = 0

  for (const { match } of collectPlayedMatches(championships)) {
    if (!match.venue) continue
    total += 1
    const name = canonicalVenueName(match.venue)
    const key = name.toLowerCase()
    const entry = venues.get(key) ?? { name, matches: 0, wins: 0 }
    entry.matches += 1
    if (match.outcome === 'win') entry.wins += 1
    venues.set(key, entry)
  }

  return [...venues.values()]
    .map((entry) => ({
      venueId: slugify(entry.name),
      venueName: entry.name,
      matches: entry.matches,
      wins: entry.wins,
      share: total > 0 ? entry.matches / total : 0,
      ...(entry.matches >= MIN_MATCHES_FOR_RATE_RANKING
        ? { winRate: entry.wins / entry.matches }
        : {}),
    }))
    .sort((a, b) => b.matches - a.matches || a.venueName.localeCompare(b.venueName, 'es'))
}
