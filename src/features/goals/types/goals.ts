import type { FootballFormat } from '@/config/football-format'

/** A goal is scoped by the same football format as every other sports entity. */
export type GoalFormat = FootballFormat

export type GoalCompetitionType = 'official' | 'friendly' | 'preseason' | 'other'

/**
 * A competition a goal belongs to. `official` competitions map to a published
 * championship through `championshipId`; friendly and preseason goals have no
 * championship and only ever appear on the Goles page.
 */
export type GoalCompetition = {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly format: GoalFormat
  readonly type: GoalCompetitionType
  readonly championshipId?: string
}

export type GoalScorer = {
  readonly id: string
  readonly slug: string
  readonly name: string
}

export type GoalCloudinaryAsset = {
  readonly publicId: string
  readonly version?: number
  readonly format: string
  readonly resourceType: 'video'
  readonly secureUrl: string
  readonly playbackUrl: string
  /** Width-capped rendition served to phones. Absent on manifests built before it existed. */
  readonly compactPlaybackUrl?: string
  readonly posterUrl: string
  readonly downloadUrl: string
}

export type GoalMedia = {
  readonly width?: number
  readonly height?: number
  readonly duration?: number
  readonly bytes: number
  readonly aspectRatio?: number
}

export type GoalSource = {
  readonly fileName: string
  readonly createdAt: string
  readonly hash: string
}

export type GoalVideo = {
  readonly id: string
  readonly format: GoalFormat
  readonly scorer: GoalScorer
  readonly competition: GoalCompetition
  readonly cloudinary: GoalCloudinaryAsset
  readonly media: GoalMedia
  readonly source: GoalSource
}

export type GoalsManifest = {
  readonly generatedAt: string
  readonly goals: readonly GoalVideo[]
}

export {
  FOOTBALL_FORMATS as GOAL_FORMATS,
  FOOTBALL_FORMAT_LABEL as GOAL_FORMAT_LABEL,
  FOOTBALL_FORMAT_LONG_LABEL as GOAL_FORMAT_LONG_LABEL,
} from '@/config/football-format'
