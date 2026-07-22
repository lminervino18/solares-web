export type MatchResult = 'victoria' | 'empate' | 'derrota'

export type Match = {
  id: string
  competitionId: string
  opponent: string
  date: string
  isHome: boolean
  goalsFor: number
  goalsAgainst: number
  result: MatchResult
}
