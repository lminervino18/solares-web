import type { TeamCategory } from './team'

export type CompetitionStatus = 'proximo' | 'en-curso' | 'finalizado'

export type Competition = {
  id: string
  name: string
  season: string
  category: TeamCategory
  status: CompetitionStatus
}
