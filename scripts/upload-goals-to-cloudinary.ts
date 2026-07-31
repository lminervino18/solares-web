import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { v2 as cloudinary } from 'cloudinary'
import { config as loadEnv } from 'dotenv'
import pLimit from 'p-limit'

import type { GoalCompetition, GoalFormat, GoalScorer } from '@/features/goals/types/goals'
import { writeGoalsManifest } from './goals/goal-manifest'
import {
  isAlreadyUploaded,
  loadUploadState,
  saveUploadState,
  type UploadEntry,
} from './goals/goal-upload-state'
import {
  delay,
  formatBytes,
  isPermanentError,
  readErrorMessage,
  sanitizeContextValue,
  sanitizeTag,
} from './goals/goal-upload-utils'

/**
 * Uploads the inspected goal clips to Cloudinary and rebuilds the public
 * manifest.
 *
 * Reads `CLOUDINARY_URL` from `.env.local` through the SDK's own environment
 * handling and never prints, stores or forwards it. Uploads run with a low
 * concurrency, resume from a local checkpoint, never overwrite an existing
 * asset and never modify or delete the local originals. `--dry-run` reports
 * exactly what would be uploaded without contacting the upload API.
 */

const GOALS_ROOT = 'Goles/web'
const INSPECTION_PATH = 'data/goals/goals-inspection.generated.json'
const DEFAULT_CONCURRENCY = 2
const CHUNK_SIZE_BYTES = 6 * 1024 * 1024
const MAX_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 1500
const UPLOAD_TIMEOUT_MS = 120_000

type InspectedGoal = {
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

type UploadResult = {
  readonly goal: InspectedGoal
  readonly entry: UploadEntry
  readonly outcome: 'uploaded' | 'skipped' | 'failed'
}

function readInspection(): readonly InspectedGoal[] {
  if (!existsSync(INSPECTION_PATH)) {
    console.error(`Missing ${INSPECTION_PATH}. Run "npm run goals:inspect" first.`)
    process.exit(1)
  }
  const raw: unknown = JSON.parse(readFileSync(INSPECTION_PATH, 'utf-8'))
  if (typeof raw !== 'object' || raw === null || !('resolved' in raw)) {
    console.error(`${INSPECTION_PATH} is not a valid inspection report.`)
    process.exit(1)
  }
  const { resolved } = raw as { resolved: unknown }
  if (!Array.isArray(resolved)) {
    console.error(`${INSPECTION_PATH} has no resolved goals.`)
    process.exit(1)
  }
  return resolved as InspectedGoal[]
}

function requireCredentials(): void {
  loadEnv({ path: '.env.local', quiet: true })
  if ((process.env.CLOUDINARY_URL ?? '').trim().length === 0) {
    console.error('Missing CLOUDINARY_URL. Add it to .env.local before uploading.')
    process.exit(1)
  }
  // ESM evaluates the Cloudinary import before dotenv runs, so the SDK starts
  // with an empty config and has to re-read the environment explicitly.
  cloudinary.config(true)
  // `analytics: false` keeps the generated delivery URLs free of the SDK's
  // tracking query parameter, so the manifest stays deterministic.
  cloudinary.config({ secure: true, analytics: false })
  const { cloud_name: cloudName } = cloudinary.config()
  if (typeof cloudName !== 'string' || cloudName.length === 0) {
    console.error('CLOUDINARY_URL is present but could not be parsed.')
    process.exit(1)
  }
}

function buildTags(goal: InspectedGoal): string[] {
  return [
    'solares',
    'goal',
    goal.format,
    `competition:${goal.competition.slug}`,
    `scorer:${goal.scorer.slug}`,
    `type:${goal.competition.type}`,
  ].map(sanitizeTag)
}

function buildContext(goal: InspectedGoal): Record<string, string> {
  return {
    goal_id: goal.goalId,
    format: goal.format,
    competition_name: sanitizeContextValue(goal.competition.name),
    competition_slug: goal.competition.slug,
    competition_type: goal.competition.type,
    scorer_name: sanitizeContextValue(goal.scorer.name),
    scorer_slug: goal.scorer.slug,
    source_filename: sanitizeContextValue(goal.fileName),
    source_created_at: goal.createdAt,
    source_hash: goal.hash,
  }
}

async function uploadOnce(goal: InspectedGoal): Promise<Record<string, unknown>> {
  const filePath = join(GOALS_ROOT, goal.sourcePath)
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        resource_type: 'video',
        public_id: goal.publicId,
        overwrite: false,
        unique_filename: false,
        use_filename: false,
        invalidate: false,
        chunk_size: CHUNK_SIZE_BYTES,
        timeout: UPLOAD_TIMEOUT_MS,
        tags: buildTags(goal),
        context: buildContext(goal),
      },
      (error: unknown, result: unknown) => {
        if (error !== undefined && error !== null) reject(error)
        else if (result === undefined || result === null) reject(new Error('Empty upload response'))
        else resolve(result as Record<string, unknown>)
      },
    )
  })
}

function readNumber(source: Record<string, unknown>, key: string): number | undefined {
  const value = source[key]
  return typeof value === 'number' ? value : undefined
}

async function uploadGoal(goal: InspectedGoal, previousAttempts: number): Promise<UploadResult> {
  let attempts = previousAttempts

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    attempts += 1
    try {
      const result = await uploadOnce(goal)
      const format = result.format
      return {
        goal,
        outcome: 'uploaded',
        entry: {
          status: 'uploaded',
          publicId: goal.publicId,
          attempts,
          updatedAt: new Date().toISOString(),
          bytes: readNumber(result, 'bytes') ?? goal.bytes,
          ...(readNumber(result, 'version') === undefined
            ? {}
            : { assetVersion: readNumber(result, 'version') }),
          ...(typeof format === 'string' ? { format } : {}),
          ...(readNumber(result, 'duration') === undefined
            ? {}
            : { duration: readNumber(result, 'duration') }),
          ...(readNumber(result, 'width') === undefined
            ? {}
            : { width: readNumber(result, 'width') }),
          ...(readNumber(result, 'height') === undefined
            ? {}
            : { height: readNumber(result, 'height') }),
        },
      }
    } catch (error: unknown) {
      const message = readErrorMessage(error)
      if (isPermanentError(error)) {
        console.error(`  auth/permission failure on ${goal.sourcePath}: ${message}`)
        return {
          goal,
          outcome: 'failed',
          entry: {
            status: 'failed',
            publicId: goal.publicId,
            attempts,
            updatedAt: new Date().toISOString(),
            error: message,
          },
        }
      }
      if (attempt === MAX_ATTEMPTS) {
        console.error(`  failed ${goal.sourcePath} after ${attempt} attempts: ${message}`)
        return {
          goal,
          outcome: 'failed',
          entry: {
            status: 'failed',
            publicId: goal.publicId,
            attempts,
            updatedAt: new Date().toISOString(),
            error: message,
          },
        }
      }
      await delay(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1))
    }
  }

  throw new Error('unreachable')
}

function reportDryRun(goals: readonly InspectedGoal[], pending: readonly InspectedGoal[]): void {
  const bytes = pending.reduce((total, goal) => total + goal.bytes, 0)
  const byFormat = (format: GoalFormat) => goals.filter((goal) => goal.format === format).length
  const pendingByFormat = (format: GoalFormat) =>
    pending.filter((goal) => goal.format === format).length

  console.log('Dry run: nothing was uploaded.\n')
  console.log(`Inspected goals: ${goals.length} (F8=${byFormat('f8')}, F5=${byFormat('f5')})`)
  console.log(
    `Would upload:    ${pending.length} (F8=${pendingByFormat('f8')}, F5=${pendingByFormat('f5')})`,
  )
  console.log(`Already done:    ${goals.length - pending.length}`)
  console.log(`Transfer size:   ${formatBytes(bytes)}\n`)
  console.log('Sample public IDs:')
  for (const goal of pending.slice(0, 5)) console.log(`  ${goal.publicId}`)
  if (pending.length > 5) console.log(`  ... and ${pending.length - 5} more`)
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')
  const goals = readInspection()
  const state = loadUploadState()
  const pending = goals.filter((goal) => !isAlreadyUploaded(state, goal.hash, goal.publicId))

  if (dryRun) {
    reportDryRun(goals, pending)
    return
  }

  requireCredentials()

  if (pending.length === 0) {
    console.log('Every goal is already uploaded. Rebuilding the manifest.')
  } else {
    const concurrency = Number(process.env.GOALS_UPLOAD_CONCURRENCY ?? DEFAULT_CONCURRENCY)
    const limit = pLimit(
      Number.isFinite(concurrency) && concurrency > 0 ? concurrency : DEFAULT_CONCURRENCY,
    )
    console.log(`Uploading ${pending.length} goals with concurrency ${limit.concurrency}.`)

    let completed = 0
    const results = await Promise.all(
      pending.map((goal) =>
        limit(async () => {
          const previous = state.entries[goal.hash]?.attempts ?? 0
          const result = await uploadGoal(goal, previous)
          state.entries[goal.hash] = result.entry
          saveUploadState(state)
          completed += 1
          const status = result.outcome === 'uploaded' ? 'ok  ' : 'fail'
          console.log(`  [${completed}/${pending.length}] ${status} ${goal.sourcePath}`)
          return result
        }),
      ),
    )

    const uploaded = results.filter((result) => result.outcome === 'uploaded').length
    const failed = results.filter((result) => result.outcome === 'failed').length
    console.log(
      `\nUploaded: ${uploaded}, failed: ${failed}, skipped: ${goals.length - pending.length}`,
    )
  }

  const manifest = writeGoalsManifest(goals, state)
  console.log(`Manifest: ${manifest.total} goals (F8=${manifest.f8}, F5=${manifest.f5})`)
  if (manifest.missing > 0) {
    console.warn(`${manifest.missing} goals are not in the manifest because their upload failed.`)
  }
}

main().catch((error: unknown) => {
  console.error(readErrorMessage(error))
  process.exit(1)
})
