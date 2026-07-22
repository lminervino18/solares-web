import type { FootballFormat, Scorer } from '../types/championships'
import { normalizeCellValue, slugify } from '../utils/normalizeCellValue'
import type { RawMatch } from './mapMatches'

const OWN_GOAL_MARKERS = new Set(['en contra', 'gol en contra', 'ec'])

function isOwnGoal(name: string): boolean {
  return OWN_GOAL_MARKERS.has(name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim())
}

/**
 * Aggregates scorers from a championship's matches.
 *
 * The `Goleadores` cell is a comma-separated list of player names, one entry
 * per goal. Own goals (`En Contra`) count toward goals for but are not players,
 * so they are excluded. Ties are broken alphabetically for a deterministic
 * order.
 */
export function mapScorers(
  matches: readonly RawMatch[],
  championshipId: string,
  format: FootballFormat,
): readonly Scorer[] {
  const goals = new Map<string, { name: string; goals: number }>()

  for (const match of matches) {
    if (!match.scorersRaw) continue
    for (const entry of match.scorersRaw.split(',')) {
      const name = normalizeCellValue(entry)
      if (!name || isOwnGoal(name)) continue
      const key = name.toLowerCase()
      const current = goals.get(key)
      if (current) {
        current.goals += 1
      } else {
        goals.set(key, { name, goals: 1 })
      }
    }
  }

  return [...goals.values()]
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name, 'es'))
    .map((scorer) => ({
      id: `${championshipId}-${slugify(scorer.name)}`,
      championshipId,
      format,
      playerName: scorer.name,
      goals: scorer.goals,
    }))
}
