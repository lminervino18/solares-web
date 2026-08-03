import type { Championship, Match } from '@/features/championships/types/championships'

export type MatchWithContext = {
  readonly match: Match
  readonly championship: Championship
}

export function isPlayedMatch(match: Match): boolean {
  const decided = match.outcome === 'win' || match.outcome === 'draw' || match.outcome === 'loss'
  return decided && match.goalsFor !== undefined && match.goalsAgainst !== undefined
}

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
