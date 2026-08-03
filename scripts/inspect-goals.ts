import { createHash } from 'node:crypto'
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'

import pLimit from 'p-limit'

import type { GoalCompetition, GoalFormat, GoalScorer } from '@/features/goals/types/goals'
import { compareGoalCompetitions } from '@/features/goals/utils/compareGoalCompetitions'
import {
  buildGoalCompetition,
  buildGoalId,
  buildGoalPublicId,
  buildGoalScorer,
  parseGoalFileName,
} from './goals/goal-file-parser'
import { GOAL_SOURCE_OVERRIDES } from './goals/goals-source-overrides'

import {
  INSPECTION_REPORT_PATH as REPORT_PATH,
  resolveFormatDirectory,
  resolveGoalsRoot,
} from './goals/goal-paths'

const CHAMPIONSHIPS_SNAPSHOT_PATH =
  'src/features/championships/data/generated/championships.snapshot.json'

const GOALS_ROOT = resolveGoalsRoot()
const SUPPORTED_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'])
const HASH_CONCURRENCY = 8

type InspectedFile = {
  readonly sourcePath: string
  readonly fileName: string
  readonly format: GoalFormat
  readonly extension: string
  readonly bytes: number
  readonly createdAt: string
  readonly modifiedAt: string
}

type ResolvedGoal = InspectedFile & {
  readonly goalId: string
  readonly hash: string
  readonly publicId: string
  readonly competition: GoalCompetition
  readonly scorer: GoalScorer
  readonly warnings: readonly string[]
}

type UnresolvedGoal = InspectedFile & {
  readonly hash: string
  readonly reason: string
}

type DuplicateGoal = {
  readonly hash: string
  readonly keptSourcePath: string
  readonly duplicateSourcePaths: readonly string[]
}

async function hashFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}

async function listFormatFiles(format: GoalFormat): Promise<InspectedFile[]> {
  const directory = resolveFormatDirectory(GOALS_ROOT, format)
  if (directory === undefined) return []
  const formatFolder = basename(directory)

  const entries = await readdir(directory, { withFileTypes: true })
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
  files.sort((a, b) => a.localeCompare(b, 'es-AR'))

  const inspected: InspectedFile[] = []
  for (const fileName of files) {
    const sourcePath = `${formatFolder}/${fileName}`
    const stats = await stat(join(directory, fileName))
    inspected.push({
      sourcePath,
      fileName,
      format,
      extension: extname(fileName).toLowerCase(),
      bytes: stats.size,
      createdAt: stats.birthtime.toISOString(),
      modifiedAt: stats.mtime.toISOString(),
    })
  }
  return inspected
}

function knownChampionshipIds(): ReadonlySet<string> {
  if (!existsSync(CHAMPIONSHIPS_SNAPSHOT_PATH)) return new Set()
  const raw: unknown = JSON.parse(readFileSync(CHAMPIONSHIPS_SNAPSHOT_PATH, 'utf-8'))
  if (typeof raw !== 'object' || raw === null || !('championships' in raw)) return new Set()
  const { championships } = raw as { championships: unknown }
  if (!Array.isArray(championships)) return new Set()
  return new Set(
    championships
      .map((entry: unknown) =>
        typeof entry === 'object' && entry !== null && 'id' in entry
          ? String((entry as { id: unknown }).id)
          : '',
      )
      .filter((id) => id.length > 0),
  )
}

function resolveFile(file: InspectedFile, hash: string, championshipIds: ReadonlySet<string>) {
  const override = GOAL_SOURCE_OVERRIDES[file.sourcePath]
  if (override?.skip === true) {
    return { kind: 'skipped' as const }
  }

  const parsed = parseGoalFileName(file.fileName)
  const competitionName = override?.competitionName ?? parsed?.competitionName
  const scorerName = override?.scorerName ?? parsed?.scorerName

  if (competitionName === undefined || scorerName === undefined) {
    return {
      kind: 'unresolved' as const,
      reason: 'File name does not match {Competition}-{Scorer}-{index}',
    }
  }

  const competition = buildGoalCompetition(file.format, competitionName)
  const scorer = buildGoalScorer(scorerName)
  const warnings: string[] = []

  if (
    competition.championshipId !== undefined &&
    !championshipIds.has(competition.championshipId)
  ) {
    warnings.push(`No published championship matches ${competition.championshipId}`)
  }

  return {
    kind: 'resolved' as const,
    goal: {
      ...file,
      goalId: buildGoalId(file.format, hash),
      hash,
      publicId: buildGoalPublicId(competition, scorer, hash),
      competition,
      scorer,
      warnings,
    } satisfies ResolvedGoal,
  }
}

function summarizeCompetitions(goals: readonly ResolvedGoal[]) {
  const byId = new Map<string, { competition: GoalCompetition; count: number }>()
  for (const goal of goals) {
    const current = byId.get(goal.competition.id)
    if (current === undefined)
      byId.set(goal.competition.id, { competition: goal.competition, count: 1 })
    else current.count += 1
  }
  return [...byId.values()]
    .sort((a, b) => compareGoalCompetitions(a.competition, b.competition))
    .map(({ competition, count }) => ({
      id: competition.id,
      name: competition.name,
      format: competition.format,
      type: competition.type,
      championshipId: competition.championshipId ?? null,
      goals: count,
    }))
}

function summarizeScorers(goals: readonly ResolvedGoal[]) {
  const byKey = new Map<string, { format: GoalFormat; name: string; slug: string; count: number }>()
  for (const goal of goals) {
    const key = `${goal.format}:${goal.scorer.slug}`
    const current = byKey.get(key)
    if (current === undefined) {
      byKey.set(key, {
        format: goal.format,
        name: goal.scorer.name,
        slug: goal.scorer.slug,
        count: 1,
      })
    } else current.count += 1
  }
  return [...byKey.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es-AR'),
  )
}

async function main(): Promise<void> {
  if (!existsSync(GOALS_ROOT)) {
    console.error(`Missing ${GOALS_ROOT}. Nothing to inspect.`)
    process.exit(1)
    return
  }

  const files = [...(await listFormatFiles('f8')), ...(await listFormatFiles('f5'))]
  const supported = files.filter((file) => SUPPORTED_EXTENSIONS.has(file.extension))
  const unsupported = files.filter((file) => !SUPPORTED_EXTENSIONS.has(file.extension))

  const limit = pLimit(HASH_CONCURRENCY)
  const hashes = await Promise.all(
    supported.map((file) =>
      limit(async () => ({ file, hash: await hashFile(join(GOALS_ROOT, file.sourcePath)) })),
    ),
  )

  const championshipIds = knownChampionshipIds()
  const resolved: ResolvedGoal[] = []
  const unresolvedFiles: UnresolvedGoal[] = []
  const seenHashes = new Map<string, string>()
  const duplicatesByHash = new Map<string, string[]>()

  for (const { file, hash } of hashes) {
    const firstSeen = seenHashes.get(hash)
    if (firstSeen !== undefined) {
      const list = duplicatesByHash.get(hash) ?? []
      list.push(file.sourcePath)
      duplicatesByHash.set(hash, list)
      continue
    }

    const outcome = resolveFile(file, hash, championshipIds)
    if (outcome.kind === 'skipped') continue
    if (outcome.kind === 'unresolved') {
      unresolvedFiles.push({ ...file, hash, reason: outcome.reason })
      continue
    }

    seenHashes.set(hash, file.sourcePath)
    resolved.push(outcome.goal)
  }

  const duplicates: DuplicateGoal[] = [...duplicatesByHash.entries()]
    .map(([hash, duplicateSourcePaths]) => ({
      hash,
      keptSourcePath: seenHashes.get(hash) ?? '',
      duplicateSourcePaths: [...duplicateSourcePaths].sort(),
    }))
    .sort((a, b) => a.hash.localeCompare(b.hash))

  const ambiguous = resolved.filter((goal) => goal.warnings.length > 0)
  const totalBytes = supported.reduce((total, file) => total + file.bytes, 0)
  const byFormat = (format: GoalFormat) => resolved.filter((goal) => goal.format === format)

  const report = {
    generatedAt: new Date().toISOString(),
    root: GOALS_ROOT,
    summary: {
      files: files.length,
      supported: supported.length,
      unsupported: unsupported.length,
      resolved: resolved.length,
      ambiguous: ambiguous.length,
      unresolved: unresolvedFiles.length,
      duplicates: duplicates.length,
      totalBytes,
      byFormat: {
        f8: {
          goals: byFormat('f8').length,
          bytes: byFormat('f8').reduce((t, g) => t + g.bytes, 0),
        },
        f5: {
          goals: byFormat('f5').length,
          bytes: byFormat('f5').reduce((t, g) => t + g.bytes, 0),
        },
      },
    },
    competitions: summarizeCompetitions(resolved),
    scorers: summarizeScorers(resolved),
    resolved: [...resolved].sort((a, b) => a.goalId.localeCompare(b.goalId)),
    ambiguous: ambiguous.map((goal) => ({ sourcePath: goal.sourcePath, warnings: goal.warnings })),
    unresolved: unresolvedFiles,
    duplicates,
    unsupported: unsupported.map((file) => file.sourcePath),
  }

  await mkdir(dirname(REPORT_PATH), { recursive: true })
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`)

  console.log(`Wrote ${REPORT_PATH}`)
  console.log(
    `Files: ${report.summary.files} (F8=${report.summary.byFormat.f8.goals}, F5=${report.summary.byFormat.f5.goals})`,
  )
  console.log(
    `Resolved: ${report.summary.resolved}, ambiguous: ${report.summary.ambiguous}, unresolved: ${report.summary.unresolved}, duplicates: ${report.summary.duplicates}, unsupported: ${report.summary.unsupported}`,
  )
  console.log(`Total size: ${(totalBytes / 1024 ** 2).toFixed(1)} MB`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
