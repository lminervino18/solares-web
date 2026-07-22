import type { FootballFormat, Scorer } from '../types/championships'
import { slugify } from '../utils/normalizeCellValue'
import { parseGoalscorers } from '../utils/parseGoalscorers'
import type { RawMatch } from './mapMatches'

/**
 * Aggregates scorers across a championship's matches.
 *
 * Own goals (`En Contra`) are excluded (handled by {@link parseGoalscorers}).
 * Ties are broken alphabetically for a deterministic order.
 */
export function mapScorers(
  matches: readonly RawMatch[],
  championshipId: string,
  format: FootballFormat,
): readonly Scorer[] {
  const totals = new Map<string, { name: string; goals: number }>()

  for (const match of matches) {
    for (const scorer of parseGoalscorers(match.scorersRaw)) {
      const key = scorer.name.toLowerCase()
      const current = totals.get(key)
      if (current) {
        current.goals += scorer.goals
      } else {
        totals.set(key, { name: scorer.name, goals: scorer.goals })
      }
    }
  }

  return [...totals.values()]
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name, 'es'))
    .map((scorer) => ({
      id: `${championshipId}-${slugify(scorer.name)}`,
      championshipId,
      format,
      playerName: scorer.name,
      goals: scorer.goals,
    }))
}
