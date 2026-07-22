import type { FootballFormat } from '@/config/championships-source.config'

export type { FootballFormat }

export type ChampionshipStatus = 'scheduled' | 'in-progress' | 'completed' | 'unknown'

export type ChampionshipHonorType =
  | 'gold-champion'
  | 'silver-champion'
  | 'gold-runner-up'
  | 'silver-runner-up'
  | 'semifinalist'
  | 'quarterfinalist'
  | 'group-stage'
  | 'other'
  | 'unknown'

export type TrophyTier = 'gold' | 'silver' | 'none'

export type MatchOutcome = 'win' | 'draw' | 'loss' | 'pending' | 'cancelled'

export type YouTubeVideo = {
  readonly videoId: string
  readonly url: string
  readonly embedUrl: string
}

export type ChampionshipAssets = {
  readonly teamPhoto?: string
  readonly teamPhotoWebp?: string
  readonly teamPhotoWidth?: number
  readonly teamPhotoHeight?: number
  readonly teamPhotoAlt?: string
  readonly tournamentLogo?: string
  readonly tournamentLogoAlt?: string
  readonly objectPosition?: string
}

export type Match = {
  readonly id: string
  readonly championshipId: string
  readonly format: FootballFormat
  readonly sourceOrder: number
  readonly date?: string
  readonly stage?: string
  readonly venue?: string
  readonly opponent: string
  readonly goalsFor?: number
  readonly goalsAgainst?: number
  readonly outcome: MatchOutcome
  readonly scoreLabel?: string
  readonly isFinal: boolean
  readonly youtubeUrl?: string
}

export type Scorer = {
  readonly id: string
  readonly championshipId: string
  readonly format: FootballFormat
  readonly playerName: string
  readonly goals: number
}

export type ChampionshipStats = {
  readonly played: number
  readonly won: number
  readonly drawn: number
  readonly lost: number
  readonly goalsFor: number
  readonly goalsAgainst: number
  readonly goalDifference: number
}

export type Championship = {
  readonly id: string
  readonly slug: string
  readonly format: FootballFormat
  readonly name: string
  readonly shortName?: string
  readonly year?: number
  readonly season?: string
  readonly league?: string
  readonly status: ChampionshipStatus
  readonly resultLabel?: string
  readonly honorType: ChampionshipHonorType
  readonly trophyTier: TrophyTier
  readonly sourceOrder: number
  readonly matches: readonly Match[]
  readonly scorers: readonly Scorer[]
  readonly stats: ChampionshipStats
  readonly assets: ChampionshipAssets
  readonly finalVideo?: YouTubeVideo
}

export type ChampionshipsByFormat = {
  readonly f8: readonly Championship[]
  readonly f5: readonly Championship[]
}

export type ChampionshipsSnapshot = {
  readonly syncedAt: string
  readonly championships: readonly Championship[]
}
