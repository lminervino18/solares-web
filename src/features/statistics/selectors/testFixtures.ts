import type { Championship, Match } from '@/features/championships/types/championships'

let matchCounter = 0

export function makeMatch(partial: Partial<Match> = {}): Match {
  matchCounter += 1
  return {
    id: `m-${matchCounter}`,
    championshipId: 'c',
    format: 'f8',
    sourceOrder: matchCounter,
    opponent: 'Rival',
    outcome: 'win',
    goalsFor: 1,
    goalsAgainst: 0,
    scorers: [],
    isFinal: false,
    ...partial,
  }
}

export function makeChampionship(partial: Partial<Championship> = {}): Championship {
  const matches = partial.matches ?? []
  return {
    id: partial.id ?? 'f8-torneo',
    slug: partial.slug ?? 'torneo',
    format: partial.format ?? 'f8',
    name: partial.name ?? 'Torneo',
    published: partial.published ?? true,
    status: partial.status ?? 'completed',
    honorType: partial.honorType ?? 'unknown',
    trophyTier: partial.trophyTier ?? 'none',
    sourceOrder: partial.sourceOrder ?? 0,
    matches,
    scorers: partial.scorers ?? [],
    stats: partial.stats ?? {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    },
    assets: partial.assets ?? {},
    ...(partial.year !== undefined ? { year: partial.year } : {}),
    ...(partial.season ? { season: partial.season } : {}),
    ...(partial.league ? { league: partial.league } : {}),
    ...(partial.resultLabel ? { resultLabel: partial.resultLabel } : {}),
    ...(partial.finalVideo ? { finalVideo: partial.finalVideo } : {}),
  }
}
