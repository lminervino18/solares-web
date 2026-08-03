import { execFile } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'

import pLimit from 'p-limit'

import { DUPLICATES_REPORT_PATH, GOALS_ROOT, INSPECTION_REPORT_PATH } from './goals/goal-paths'

const run = promisify(execFile)

const FRAME_COUNT = 6
const FINGERPRINT_SIZE = 9
const FRAME_CONCURRENCY = 4
const MAX_DISTANCE = 12

type ResolvedGoal = {
  readonly sourcePath: string
  readonly fileName: string
  readonly format: string
  readonly goalId: string
  readonly competition: { readonly id: string; readonly name: string }
  readonly scorer: { readonly id: string; readonly name: string }
}

async function fingerprint(sourcePath: string): Promise<string | undefined> {
  const filePath = join(GOALS_ROOT, sourcePath)
  try {
    const { stdout } = await run(
      'ffmpeg',
      [
        '-v',
        'error',
        '-i',
        filePath,
        '-vf',
        `fps=2,scale=${String(FINGERPRINT_SIZE)}:${String(FINGERPRINT_SIZE)},format=gray`,
        '-frames:v',
        String(FRAME_COUNT),
        '-f',
        'rawvideo',
        '-',
      ],
      { encoding: 'buffer', maxBuffer: 1024 * 1024 },
    )

    const pixels = stdout as unknown as Buffer
    const perFrame = FINGERPRINT_SIZE * FINGERPRINT_SIZE
    const bits: string[] = []

    for (let frame = 0; frame * perFrame < pixels.length; frame += 1) {
      const offset = frame * perFrame
      for (let row = 0; row < FINGERPRINT_SIZE; row += 1) {
        for (let column = 0; column < FINGERPRINT_SIZE - 1; column += 1) {
          const left = pixels[offset + row * FINGERPRINT_SIZE + column] ?? 0
          const right = pixels[offset + row * FINGERPRINT_SIZE + column + 1] ?? 0
          bits.push(left > right ? '1' : '0')
        }
      }
    }

    return bits.length === 0 ? undefined : bits.join('')
  } catch {
    return undefined
  }
}

function distance(a: string, b: string): number {
  const length = Math.min(a.length, b.length)
  let different = Math.abs(a.length - b.length)
  for (let index = 0; index < length; index += 1) {
    if (a[index] !== b[index]) different += 1
  }
  return different
}

function readResolvedGoals(): readonly ResolvedGoal[] {
  if (!existsSync(INSPECTION_REPORT_PATH)) {
    console.error(`Missing ${INSPECTION_REPORT_PATH}. Run "npm run goals:inspect" first.`)
    process.exit(1)
  }
  const raw: unknown = JSON.parse(readFileSync(INSPECTION_REPORT_PATH, 'utf-8'))
  const resolved =
    typeof raw === 'object' && raw !== null && 'resolved' in raw
      ? (raw as { resolved: unknown }).resolved
      : undefined
  if (!Array.isArray(resolved)) {
    console.error(`${INSPECTION_REPORT_PATH} has no resolved goals.`)
    process.exit(1)
  }
  return resolved as ResolvedGoal[]
}

async function main(): Promise<void> {
  try {
    await run('ffmpeg', ['-version'])
  } catch {
    console.error('ffmpeg is required for this diagnostic and was not found on the PATH.')
    process.exit(1)
  }

  const goals = readResolvedGoals()
  const limit = pLimit(FRAME_CONCURRENCY)
  let done = 0

  const fingerprints = await Promise.all(
    goals.map((goal) =>
      limit(async () => {
        const value = await fingerprint(goal.sourcePath)
        done += 1
        if (done % 40 === 0) console.log(`  fingerprinted ${done}/${goals.length}`)
        return { goal, value }
      }),
    ),
  )

  const usable = fingerprints.filter(
    (entry): entry is { goal: ResolvedGoal; value: string } => entry.value !== undefined,
  )

  const groups = new Map<string, typeof usable>()
  for (const entry of usable) {
    const key = `${entry.goal.format}|${entry.goal.competition.id}|${entry.goal.scorer.id}`
    const group = groups.get(key) ?? []
    group.push(entry)
    groups.set(key, group)
  }

  const pairs: unknown[] = []
  for (const group of groups.values()) {
    for (let i = 0; i < group.length; i += 1) {
      for (let j = i + 1; j < group.length; j += 1) {
        const a = group[i]
        const b = group[j]
        if (a === undefined || b === undefined) continue
        const bits = distance(a.value, b.value)
        if (bits > MAX_DISTANCE) continue
        pairs.push({
          distance: bits,
          competition: a.goal.competition.name,
          scorer: a.goal.scorer.name,
          format: a.goal.format,
          a: { goalId: a.goal.goalId, sourcePath: a.goal.sourcePath },
          b: { goalId: b.goal.goalId, sourcePath: b.goal.sourcePath },
        })
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    compared: usable.length,
    skipped: goals.length - usable.length,
    maxDistance: MAX_DISTANCE,
    candidates: pairs,
  }

  await mkdir(dirname(DUPLICATES_REPORT_PATH), { recursive: true })
  writeFileSync(DUPLICATES_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`)

  console.log(`\nWrote ${DUPLICATES_REPORT_PATH}`)
  console.log(`Compared ${usable.length} clips, skipped ${report.skipped}.`)
  console.log(`Duplicate candidates: ${pairs.length}`)
  if (pairs.length > 0) {
    console.log('\nNothing was deleted. Review each pair, then mark the unwanted file `skip`')
    console.log('in scripts/goals/goals-source-overrides.ts and run "npm run goals:prune".')
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
