import { existsSync, readFileSync } from 'node:fs'

import pLimit from 'p-limit'

// A clip's first delivery is slow because the CDN edge has to fetch it from the
// origin; the same request served again from the edge is an order of magnitude
// faster. Requesting every rendition once after an upload moves that cost off
// the first real visitor. It warms the edge nearest to whoever runs it, which is
// the right one when the audience and the operator share a region.

const MANIFEST_PATH = 'src/features/goals/data/generated/goals.manifest.json'

/** Enough to make the edge pull and cache the object. */
const WARM_BYTES = 262_144
const CONCURRENCY = 6

type ManifestGoal = {
  readonly id: string
  readonly cloudinary: { readonly playbackUrl: string; readonly compactPlaybackUrl?: string }
}

function readGoals(): readonly ManifestGoal[] {
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

async function warm(url: string): Promise<number | undefined> {
  const startedAt = performance.now()
  try {
    const response = await fetch(url, { headers: { Range: `bytes=0-${String(WARM_BYTES - 1)}` } })
    if (!response.ok && response.status !== 206) return undefined
    await response.arrayBuffer()
    return performance.now() - startedAt
  } catch {
    return undefined
  }
}

async function main(): Promise<void> {
  const goals = readGoals()
  const urls = goals.flatMap((goal) =>
    [goal.cloudinary.playbackUrl, goal.cloudinary.compactPlaybackUrl].filter(
      (url): url is string => url !== undefined,
    ),
  )

  console.log(`Warming ${urls.length} renditions from ${goals.length} goals...`)

  const limit = pLimit(CONCURRENCY)
  const timings = await Promise.all(urls.map((url) => limit(() => warm(url))))

  const ok = timings.filter((value): value is number => value !== undefined)
  const failed = timings.length - ok.length
  const sorted = [...ok].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0
  const slowest = sorted.at(-1) ?? 0

  console.log(`warmed:  ${ok.length}`)
  console.log(`failed:  ${failed}`)
  console.log(`median:  ${median.toFixed(0)} ms`)
  console.log(`slowest: ${slowest.toFixed(0)} ms`)

  if (failed > 0) {
    console.error('\nSome renditions could not be warmed. They still play, just slower once.')
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
