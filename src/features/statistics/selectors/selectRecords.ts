import type { Championship } from '@/features/championships/types/championships'
import type { MatchRecord, MatchRecords } from '../types/statistics'
import { collectPlayedMatches, type MatchWithContext } from '../utils/collectMatches'

function toRecord({ match, championship }: MatchWithContext): MatchRecord {
  return {
    matchId: match.id,
    championshipId: championship.id,
    championshipName: championship.name,
    slug: championship.slug,
    format: championship.format,
    opponent: match.opponent,
    scoreLabel: match.scoreLabel ?? `${match.goalsFor ?? 0}-${match.goalsAgainst ?? 0}`,
    goalsFor: match.goalsFor ?? 0,
    goalsAgainst: match.goalsAgainst ?? 0,
    ...(match.date ? { date: match.date } : {}),
  }
}

function best<T>(
  items: readonly T[],
  isBetter: (candidate: T, current: T) => boolean,
): T | undefined {
  let winner: T | undefined
  for (const item of items) {
    if (winner === undefined || isBetter(item, winner)) winner = item
  }
  return winner
}

function olderFirst(a: MatchWithContext, b: MatchWithContext): number {
  if (a.match.date && b.match.date) return a.match.date < b.match.date ? -1 : 1
  return 0
}

export function selectRecords(championships: readonly Championship[]): MatchRecords {
  const played = collectPlayedMatches(championships)
  if (played.length === 0) return {}

  const wins = played.filter((entry) => entry.match.outcome === 'win')
  const losses = played.filter((entry) => entry.match.outcome === 'loss')

  const biggestWin = best(wins, (candidate, current) => {
    const candidateDiff = (candidate.match.goalsFor ?? 0) - (candidate.match.goalsAgainst ?? 0)
    const currentDiff = (current.match.goalsFor ?? 0) - (current.match.goalsAgainst ?? 0)
    if (candidateDiff !== currentDiff) return candidateDiff > currentDiff
    if ((candidate.match.goalsFor ?? 0) !== (current.match.goalsFor ?? 0)) {
      return (candidate.match.goalsFor ?? 0) > (current.match.goalsFor ?? 0)
    }
    return olderFirst(candidate, current) < 0
  })

  const biggestLoss = best(losses, (candidate, current) => {
    const candidateDiff = (candidate.match.goalsFor ?? 0) - (candidate.match.goalsAgainst ?? 0)
    const currentDiff = (current.match.goalsFor ?? 0) - (current.match.goalsAgainst ?? 0)
    if (candidateDiff !== currentDiff) return candidateDiff < currentDiff
    if ((candidate.match.goalsAgainst ?? 0) !== (current.match.goalsAgainst ?? 0)) {
      return (candidate.match.goalsAgainst ?? 0) > (current.match.goalsAgainst ?? 0)
    }
    return olderFirst(candidate, current) < 0
  })

  const mostGoals = best(played, (candidate, current) => {
    const candidateTotal = (candidate.match.goalsFor ?? 0) + (candidate.match.goalsAgainst ?? 0)
    const currentTotal = (current.match.goalsFor ?? 0) + (current.match.goalsAgainst ?? 0)
    if (candidateTotal !== currentTotal) return candidateTotal > currentTotal
    return olderFirst(candidate, current) < 0
  })

  const dated = played.filter((entry) => entry.match.date)
  const mostRecent = best(
    dated,
    (candidate, current) => (candidate.match.date ?? '') > (current.match.date ?? ''),
  )
  const earliest = best(
    dated,
    (candidate, current) => (candidate.match.date ?? '') < (current.match.date ?? ''),
  )

  const scoreCounts = new Map<string, number>()
  for (const { match } of played) {
    const score = match.scoreLabel ?? `${match.goalsFor ?? 0}-${match.goalsAgainst ?? 0}`
    scoreCounts.set(score, (scoreCounts.get(score) ?? 0) + 1)
  }
  const mostFrequentScore = [...scoreCounts.entries()]
    .map(([score, count]) => ({ score, count }))
    .sort((a, b) => b.count - a.count || a.score.localeCompare(b.score))[0]

  return {
    ...(biggestWin ? { biggestWin: toRecord(biggestWin) } : {}),
    ...(biggestLoss ? { biggestLoss: toRecord(biggestLoss) } : {}),
    ...(mostGoals ? { mostGoals: toRecord(mostGoals) } : {}),
    ...(mostRecent ? { mostRecent: toRecord(mostRecent) } : {}),
    ...(earliest ? { earliest: toRecord(earliest) } : {}),
    ...(mostFrequentScore ? { mostFrequentScore } : {}),
  }
}
