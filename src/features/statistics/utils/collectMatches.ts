import type { Championship, Match } from '@/features/championships/types/championships'

export type MatchWithContext = {
  readonly match: Match
  readonly championship: Championship
}

/**
 * A match counts as played when it has a decided outcome and numeric goals for
 * and against. Pending, cancelled and unreadable matches are excluded, matching
 * the Campeonatos convention.
 */
export function isPlayedMatch(match: Match): boolean {
  const decided = match.outcome === 'win' || match.outcome === 'draw' || match.outcome === 'loss'
  return decided && match.goalsFor !== undefined && match.goalsAgainst !== undefined
}

/**
 * Flattens the played matches of a format into a single chronological list.
 *
 * Order is oldest championship first (ascending `sourceOrder`) and, within a
 * championship, the stored tournament order (stage, then date). This is stable
 * and robust against isolated date typos in the sheet.
 */
export function collectPlayedMatches(
  championships: readonly Championship[],
): readonly MatchWithContext[] {
  const ordered = [...championships].sort((a, b) => a.sourceOrder - b.sourceOrder)
  const result: MatchWithContext[] = []
  for (const championship of ordered) {
    for (const match of championship.matches) {
      if (isPlayedMatch(match)) {
        result.push({ match, championship })
      }
    }
  }
  return result
}
