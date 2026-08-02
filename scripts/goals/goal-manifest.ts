import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

import { v2 as cloudinary } from 'cloudinary'

import type {
  GoalCompetition,
  GoalFormat,
  GoalScorer,
  GoalVideo,
} from '@/features/goals/types/goals'
import { compareGoals } from '@/features/goals/utils/compareGoalCompetitions'
import type { UploadState } from './goal-upload-state'

/**
 * Builds the public goals manifest consumed by the frontend.
 *
 * Only public delivery data is written: cloud-hosted URLs, playback metadata
 * and the source identity needed for stable ordering. Credentials, signatures
 * and local paths never reach the manifest.
 */

export const MANIFEST_PATH = 'src/features/goals/data/generated/goals.manifest.json'

/**
 * The clips mix orientations (96 square, 78 landscape, 38 portrait), so no
 * source ratio fits them all. Cards use a single 4:3 frame — the balanced
 * compromise for that mix — and automatic gravity keeps the action in frame.
 * The player always renders the untouched original ratio.
 */
const POSTER_WIDTH = 640
const POSTER_ASPECT_RATIO = '4:3'

/**
 * Width cap for the phone rendition. Clips are delivered up to their source
 * width, which on a phone means paying for pixels the screen cannot show:
 * capping at 720 roughly halves the transfer with no visible difference at that
 * size. `c_limit` never upscales, so a smaller clip is served untouched.
 */
const COMPACT_PLAYBACK_WIDTH = 720

type ManifestInput = {
  readonly sourcePath: string
  readonly fileName: string
  readonly format: GoalFormat
  readonly bytes: number
  readonly createdAt: string
  readonly goalId: string
  readonly hash: string
  readonly publicId: string
  readonly competition: GoalCompetition
  readonly scorer: GoalScorer
}

export type ManifestSummary = {
  readonly total: number
  readonly f8: number
  readonly f5: number
  readonly missing: number
}

function downloadFileName(goal: ManifestInput, format: string): string {
  const parts = ['solares', goal.format, goal.competition.slug, goal.scorer.slug]
  return `${parts.join('-')}.${format}`
}

function buildGoalVideo(goal: ManifestInput, state: UploadState): GoalVideo | undefined {
  const entry = state.entries[goal.hash]
  if (entry?.status !== 'uploaded') return undefined

  const assetFormat = entry.format ?? 'mp4'
  const version = entry.assetVersion
  const versionOption = version === undefined ? {} : { version }

  const secureUrl = cloudinary.url(goal.publicId, {
    resource_type: 'video',
    format: assetFormat,
    secure: true,
    ...versionOption,
  })

  const playbackUrl = cloudinary.url(goal.publicId, {
    resource_type: 'video',
    format: 'mp4',
    secure: true,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    ...versionOption,
  })

  const compactPlaybackUrl = cloudinary.url(goal.publicId, {
    resource_type: 'video',
    format: 'mp4',
    secure: true,
    transformation: [
      { quality: 'auto', fetch_format: 'auto', width: COMPACT_PLAYBACK_WIDTH, crop: 'limit' },
    ],
    ...versionOption,
  })

  const posterUrl = cloudinary.url(goal.publicId, {
    resource_type: 'video',
    format: 'jpg',
    secure: true,
    transformation: [
      {
        start_offset: 'auto',
        width: POSTER_WIDTH,
        aspect_ratio: POSTER_ASPECT_RATIO,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
    ...versionOption,
  })

  const downloadUrl = cloudinary.url(goal.publicId, {
    resource_type: 'video',
    format: assetFormat,
    secure: true,
    flags: `attachment:${downloadFileName(goal, assetFormat).replace(/\.[^.]+$/, '')}`,
    ...versionOption,
  })

  const aspectRatio =
    entry.width !== undefined && entry.height !== undefined && entry.height > 0
      ? Number((entry.width / entry.height).toFixed(4))
      : undefined

  return {
    id: goal.goalId,
    format: goal.format,
    scorer: goal.scorer,
    competition: goal.competition,
    cloudinary: {
      publicId: goal.publicId,
      resourceType: 'video',
      format: assetFormat,
      secureUrl,
      playbackUrl,
      compactPlaybackUrl,
      posterUrl,
      downloadUrl,
      ...(version === undefined ? {} : { version }),
    },
    media: {
      bytes: entry.bytes ?? goal.bytes,
      ...(entry.width === undefined ? {} : { width: entry.width }),
      ...(entry.height === undefined ? {} : { height: entry.height }),
      ...(entry.duration === undefined ? {} : { duration: entry.duration }),
      ...(aspectRatio === undefined ? {} : { aspectRatio }),
    },
    source: {
      fileName: goal.fileName,
      createdAt: goal.createdAt,
      hash: goal.hash,
    },
  }
}

export function buildGoalsManifest(
  goals: readonly ManifestInput[],
  state: UploadState,
): readonly GoalVideo[] {
  return goals
    .map((goal) => buildGoalVideo(goal, state))
    .filter((goal): goal is GoalVideo => goal !== undefined)
    .sort(compareGoals)
}

export function writeGoalsManifest(
  goals: readonly ManifestInput[],
  state: UploadState,
): ManifestSummary {
  const entries = buildGoalsManifest(goals, state)
  mkdirSync(dirname(MANIFEST_PATH), { recursive: true })
  writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), goals: entries }, null, 2)}\n`,
  )
  return {
    total: entries.length,
    f8: entries.filter((goal) => goal.format === 'f8').length,
    f5: entries.filter((goal) => goal.format === 'f5').length,
    missing: goals.length - entries.length,
  }
}
