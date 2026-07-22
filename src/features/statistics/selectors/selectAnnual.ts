import type { Championship } from '@/features/championships/types/championships'
import type { AnnualStatistics } from '../types/statistics'
import { collectPlayedMatches } from '../utils/collectMatches'

type Accumulator = {
  matches: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  titles: number
}

function emptyYear(): Accumulator {
  return { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, titles: 0 }
}

/**
 * Aggregates played matches by calendar year (from each match date). Matches
 * without a date are excluded, so the series only reflects dated matches. Titles
 * are attributed by the championship year.
 */
export function selectAnnual(championships: readonly Championship[]): readonly AnnualStatistics[] {
  const years = new Map<number, Accumulator>()

  for (const { match } of collectPlayedMatches(championships)) {
    if (!match.date) continue
    const year = Number(match.date.slice(0, 4))
    if (!Number.isFinite(year)) continue
    const entry = years.get(year) ?? emptyYear()
    entry.matches += 1
    if (match.outcome === 'win') entry.wins += 1
    else if (match.outcome === 'draw') entry.draws += 1
    else if (match.outcome === 'loss') entry.losses += 1
    entry.goalsFor += match.goalsFor ?? 0
    entry.goalsAgainst += match.goalsAgainst ?? 0
    years.set(year, entry)
  }

  for (const championship of championships) {
    if (championship.year === undefined) continue
    const isTitle =
      championship.honorType === 'gold-champion' || championship.honorType === 'silver-champion'
    if (!isTitle) continue
    const entry = years.get(championship.year) ?? emptyYear()
    entry.titles += 1
    years.set(championship.year, entry)
  }

  return [...years.entries()]
    .map(([year, entry]) => ({ year, ...entry }))
    .sort((a, b) => a.year - b.year)
}
