import type { Championship } from '@/features/championships/types/championships'
import { slugify } from '@/features/championships/utils/normalizeCellValue'
import { canonicalPlayerName } from '../data/player-aliases'
import type { HistoricalScorer } from '../types/statistics'
import { classifyPhase, isKnockoutPhase } from '../utils/classifyPhase'

type Accumulator = {
  name: string
  goals: number
  knockoutGoals: number
  tournaments: Set<string>
}

export function selectHistoricalScorers(
  championships: readonly Championship[],
): readonly HistoricalScorer[] {
  const players = new Map<string, Accumulator>()

  for (const championship of championships) {
    for (const match of championship.matches) {
      const knockout = isKnockoutPhase(classifyPhase(match.stage))
      for (const scorer of match.scorers) {
        const name = canonicalPlayerName(scorer.name)
        const key = name.toLowerCase()
        const entry = players.get(key) ?? {
          name,
          goals: 0,
          knockoutGoals: 0,
          tournaments: new Set<string>(),
        }
        entry.goals += scorer.goals
        if (knockout) entry.knockoutGoals += scorer.goals
        entry.tournaments.add(championship.id)
        players.set(key, entry)
      }
    }
  }

  const sorted = [...players.values()].sort(
    (a, b) =>
      b.goals - a.goals ||
      b.tournaments.size - a.tournaments.size ||
      a.name.localeCompare(b.name, 'es'),
  )

  let previousGoals: number | undefined
  let previousRank = 0
  return sorted.map((entry, index) => {
    const rank = entry.goals === previousGoals ? previousRank : index + 1
    previousGoals = entry.goals
    previousRank = rank
    return {
      playerId: slugify(entry.name),
      playerName: entry.name,
      goals: entry.goals,
      rank,
      tournamentsWithGoals: entry.tournaments.size,
      knockoutGoals: entry.knockoutGoals,
    }
  })
}

export function selectKnockoutScorers(
  scorers: readonly HistoricalScorer[],
): readonly HistoricalScorer[] {
  const withKnockout = scorers
    .filter((scorer) => scorer.knockoutGoals > 0)
    .sort(
      (a, b) => b.knockoutGoals - a.knockoutGoals || a.playerName.localeCompare(b.playerName, 'es'),
    )

  let previousGoals: number | undefined
  let previousRank = 0
  return withKnockout.map((scorer, index) => {
    const rank = scorer.knockoutGoals === previousGoals ? previousRank : index + 1
    previousGoals = scorer.knockoutGoals
    previousRank = rank
    return { ...scorer, rank }
  })
}
