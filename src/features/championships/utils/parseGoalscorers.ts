import type { MatchScorer } from '../types/championships'
import { normalizeCellValue } from './normalizeCellValue'

const OWN_GOAL_MARKERS = new Set(['en contra', 'gol en contra', 'ec'])

function isOwnGoal(name: string): boolean {
  return OWN_GOAL_MARKERS.has(name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim())
}

export function parseGoalscorers(raw: string | undefined): readonly MatchScorer[] {
  if (!raw) return []
  const order: string[] = []
  const counts = new Map<string, { name: string; goals: number }>()

  for (const entry of raw.split(',')) {
    const name = normalizeCellValue(entry)
    if (!name || isOwnGoal(name)) continue
    const key = name.toLowerCase()
    const current = counts.get(key)
    if (current) {
      current.goals += 1
    } else {
      counts.set(key, { name, goals: 1 })
      order.push(key)
    }
  }

  return order.map((key) => {
    const scorer = counts.get(key)
    return { name: scorer?.name ?? '', goals: scorer?.goals ?? 0 }
  })
}
