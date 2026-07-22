import type { ChampionshipStats, Match } from '../types/championships'

const EMPTY_STATS: ChampionshipStats = {
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
}

/**
 * Derives championship statistics from its matches.
 *
 * Only matches with a decided outcome (`win` / `draw` / `loss`) and numeric
 * goals for and against are counted. Pending, cancelled or unreadable matches
 * are excluded, so `played === won + drawn + lost` always holds.
 */
export function calculateChampionshipStats(matches: readonly Match[]): ChampionshipStats {
  let won = 0
  let drawn = 0
  let lost = 0
  let goalsFor = 0
  let goalsAgainst = 0

  for (const match of matches) {
    const decided = match.outcome === 'win' || match.outcome === 'draw' || match.outcome === 'loss'
    if (!decided) continue
    if (match.goalsFor === undefined || match.goalsAgainst === undefined) continue

    if (match.outcome === 'win') won += 1
    else if (match.outcome === 'draw') drawn += 1
    else lost += 1

    goalsFor += match.goalsFor
    goalsAgainst += match.goalsAgainst
  }

  const played = won + drawn + lost
  if (played === 0 && matches.length === 0) return EMPTY_STATS

  return {
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
  }
}
