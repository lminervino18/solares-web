import type { TeamCategory } from './team'

export type PlayerPosition = 'arquero' | 'defensor' | 'mediocampista' | 'delantero'

export type Player = {
  id: string
  name: string
  number: number | null
  position: PlayerPosition
  category: TeamCategory
}
