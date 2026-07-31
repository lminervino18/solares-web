import { existsSync, readFileSync } from 'node:fs'

import { v2 as cloudinary } from 'cloudinary'
import { config as loadEnv } from 'dotenv'

import { INSPECTION_REPORT_PATH as INSPECTION_PATH } from './goals/goal-paths'
import { loadUploadState, saveUploadState } from './goals/goal-upload-state'
import { readErrorMessage } from './goals/goal-upload-utils'

/**
 * Deletes goal assets that the local collection no longer publishes.
 *
 * A clip removed from the source folder or marked `skip` in the overrides stays
 * on Cloudinary until this runs. Deletion is irreversible for the hosted asset,
 * so the script reports by default and only deletes with `--confirm`; the local
 * file is never touched, which is what makes the operation recoverable.
 */

const GOALS_PREFIX = 'solares/goals'

type InspectedGoal = { readonly publicId: string; readonly hash: string }

function readPublishedPublicIds(): ReadonlySet<string> {
  if (!existsSync(INSPECTION_PATH)) {
    console.error(`Missing ${INSPECTION_PATH}. Run "npm run goals:inspect" first.`)
    process.exit(1)
  }
  const raw: unknown = JSON.parse(readFileSync(INSPECTION_PATH, 'utf-8'))
  const resolved =
    typeof raw === 'object' && raw !== null && 'resolved' in raw
      ? (raw as { resolved: unknown }).resolved
      : undefined
  if (!Array.isArray(resolved)) {
    console.error(`${INSPECTION_PATH} has no resolved goals.`)
    process.exit(1)
  }
  return new Set((resolved as InspectedGoal[]).map((goal) => goal.publicId))
}

function requireCredentials(): void {
  loadEnv({ path: '.env.local', quiet: true })
  if ((process.env.CLOUDINARY_URL ?? '').trim().length === 0) {
    console.error('Missing CLOUDINARY_URL. Add it to .env.local first.')
    process.exit(1)
  }
  cloudinary.config(true)
  cloudinary.config({ secure: true, analytics: false })
  const { cloud_name: cloudName } = cloudinary.config()
  if (typeof cloudName !== 'string' || cloudName.length === 0) {
    console.error('CLOUDINARY_URL is present but could not be parsed.')
    process.exit(1)
  }
}

async function listRemotePublicIds(): Promise<readonly string[]> {
  const ids: string[] = []
  let cursor: string | undefined

  do {
    const response: unknown = await cloudinary.api.resources({
      resource_type: 'video',
      type: 'upload',
      prefix: GOALS_PREFIX,
      max_results: 500,
      ...(cursor === undefined ? {} : { next_cursor: cursor }),
    })
    const page = response as { resources?: { public_id?: unknown }[]; next_cursor?: unknown }
    for (const resource of page.resources ?? []) {
      if (typeof resource.public_id === 'string') ids.push(resource.public_id)
    }
    cursor = typeof page.next_cursor === 'string' ? page.next_cursor : undefined
  } while (cursor !== undefined)

  return ids.sort()
}

async function main(): Promise<void> {
  const confirmed = process.argv.includes('--confirm')
  const published = readPublishedPublicIds()

  requireCredentials()
  const remote = await listRemotePublicIds()
  const orphaned = remote.filter((publicId) => !published.has(publicId))

  console.log(`Remote goal assets: ${remote.length}`)
  console.log(`Published locally:  ${published.size}`)
  console.log(`No longer published: ${orphaned.length}`)

  if (orphaned.length === 0) {
    console.log('Nothing to prune.')
    return
  }

  for (const publicId of orphaned) console.log(`  ${publicId}`)

  if (!confirmed) {
    console.log('\nDry run: nothing was deleted. Re-run with --confirm to delete these assets.')
    return
  }

  const state = loadUploadState()
  const byPublicId = new Map(
    Object.entries(state.entries).map(([hash, entry]) => [entry.publicId, hash]),
  )

  let deleted = 0
  for (const publicId of orphaned) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video', invalidate: true })
      // Dropping the checkpoint entry keeps a later upload from believing the
      // asset is still there.
      const hash = byPublicId.get(publicId)
      if (hash !== undefined) delete state.entries[hash]
      deleted += 1
      console.log(`  deleted ${publicId}`)
    } catch (error: unknown) {
      console.error(`  failed ${publicId}: ${readErrorMessage(error)}`)
    }
  }

  saveUploadState(state)
  console.log(`\nDeleted ${deleted} of ${orphaned.length} assets.`)
}

main().catch((error: unknown) => {
  console.error(readErrorMessage(error))
  process.exit(1)
})
