import { existsSync, readFileSync } from 'node:fs'

import { v2 as cloudinary } from 'cloudinary'
import { config as loadEnv } from 'dotenv'

import { readErrorMessage } from './goal-upload-utils'

/**
 * Verifies that every goal the committed manifest publishes is really hosted.
 *
 * The manifest is what the site reads, so a missing remote asset is a broken
 * card in the gallery. This only reads: it never uploads, deletes or rewrites
 * anything. Requires `CLOUDINARY_URL`, so it is not part of `validate`.
 */

const MANIFEST_PATH = 'src/features/goals/data/generated/goals.manifest.json'
const GOALS_PREFIX = 'solares/goals'

type ManifestGoal = {
  readonly id: string
  readonly cloudinary: { readonly publicId: string }
}

function readManifestGoals(): readonly ManifestGoal[] {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`Missing ${MANIFEST_PATH}. Run "npm run goals:upload" first.`)
    process.exit(1)
  }
  const raw: unknown = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
  const goals =
    typeof raw === 'object' && raw !== null && 'goals' in raw
      ? (raw as { goals: unknown }).goals
      : undefined
  if (!Array.isArray(goals)) {
    console.error(`${MANIFEST_PATH} has no goals array.`)
    process.exit(1)
  }
  return goals as readonly ManifestGoal[]
}

function requireCredentials(): void {
  loadEnv({ path: '.env.local', quiet: true })
  if ((process.env.CLOUDINARY_URL ?? '').trim().length === 0) {
    console.error('Missing CLOUDINARY_URL. Add it to .env.local first.')
    process.exit(1)
  }
  // The SDK import is evaluated before dotenv runs, so it must re-read the env.
  cloudinary.config(true)
  cloudinary.config({ secure: true, analytics: false })
  const { cloud_name: cloudName } = cloudinary.config()
  if (typeof cloudName !== 'string' || cloudName.length === 0) {
    console.error('CLOUDINARY_URL is present but could not be parsed.')
    process.exit(1)
  }
}

async function listRemotePublicIds(): Promise<ReadonlySet<string>> {
  const ids = new Set<string>()
  let cursor: string | undefined

  do {
    const response: unknown = await cloudinary.api.resources({
      resource_type: 'video',
      type: 'upload',
      prefix: GOALS_PREFIX,
      max_results: 500,
      ...(cursor ? { next_cursor: cursor } : {}),
    })
    const page = response as {
      resources?: readonly { public_id?: unknown }[]
      next_cursor?: unknown
    }
    for (const resource of page.resources ?? []) {
      if (typeof resource.public_id === 'string') ids.add(resource.public_id)
    }
    cursor = typeof page.next_cursor === 'string' ? page.next_cursor : undefined
  } while (cursor)

  return ids
}

async function main(): Promise<void> {
  const goals = readManifestGoals()
  requireCredentials()

  const hosted = await listRemotePublicIds()
  const missing = goals.filter((goal) => !hosted.has(goal.cloudinary.publicId))
  const orphaned = [...hosted].filter(
    (publicId) => !goals.some((goal) => goal.cloudinary.publicId === publicId),
  )

  console.log(`manifest goals: ${goals.length}`)
  console.log(`hosted assets:  ${hosted.size}`)

  for (const goal of missing) {
    console.error(`missing on Cloudinary: ${goal.id} (${goal.cloudinary.publicId})`)
  }
  for (const publicId of orphaned.sort()) {
    console.log(`hosted but unpublished: ${publicId}`)
  }

  if (missing.length > 0) {
    console.error(
      `\n${missing.length} published goal(s) are not hosted. Run "npm run goals:upload".`,
    )
    process.exit(1)
    return
  }

  if (orphaned.length > 0) {
    console.log(
      `\n${orphaned.length} hosted asset(s) are not published. Run "npm run goals:prune" to review.`,
    )
  }

  console.log('\nEvery published goal is hosted.')
}

main().catch((error: unknown) => {
  console.error(readErrorMessage(error))
  process.exit(1)
})
