export type GoalFormat = 'f8' | 'f5'

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

export const GOAL_FORMATS = ['f8', 'f5'] as const

export const GOAL_FORMAT_LABEL: Record<GoalFormat, string> = {
  f8: 'F8',
  f5: 'F5',
}

export const GOAL_FORMAT_LONG_LABEL: Record<GoalFormat, string> = {
  f8: 'Fútbol 8',
  f5: 'Fútbol 5',
}
