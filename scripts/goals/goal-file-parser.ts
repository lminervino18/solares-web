import { slugify } from '@/features/championships/utils/normalizeCellValue'
import {
  canonicalGoalCompetitionName,
  resolveGoalCompetitionType,
} from '@/features/goals/data/goal-competition-aliases'
import { canonicalGoalScorerName } from '@/features/goals/data/goal-scorer-aliases'
import type { GoalCompetition, GoalFormat, GoalScorer } from '@/features/goals/types/goals'

const CANONICAL_SEPARATOR = '__'
const LEGACY_PATTERN = /^([^-]+)-([^-]+)-(\d+)$/
const SHORT_HASH_LENGTH = 12

export type GoalFileNameConvention = 'canonical' | 'legacy'

export type ParsedGoalFileName = {
  readonly competitionName: string
  readonly scorerName: string
  readonly convention: GoalFileNameConvention
}

function readable(segment: string): string {
  return segment
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

function parseCanonical(baseName: string): ParsedGoalFileName | undefined {
  const segments = baseName.split(CANONICAL_SEPARATOR)
  if (segments.length !== 3) return undefined

  const [rawCompetition, rawScorer, label] = segments
  if (!rawCompetition || !rawScorer || !label) return undefined

  const competitionName = canonicalGoalCompetitionName(readable(rawCompetition))
  const scorerName = canonicalGoalScorerName(readable(rawScorer))
  if (competitionName.length === 0 || scorerName.length === 0) return undefined

  return { competitionName, scorerName, convention: 'canonical' }
}

function parseLegacy(baseName: string): ParsedGoalFileName | undefined {
  const match = LEGACY_PATTERN.exec(baseName)
  if (match === null) return undefined

  const [, rawCompetition, rawScorer] = match
  if (rawCompetition === undefined || rawScorer === undefined) return undefined

  const competitionName = canonicalGoalCompetitionName(rawCompetition)
  const scorerName = canonicalGoalScorerName(rawScorer)
  if (competitionName.length === 0 || scorerName.length === 0) return undefined

  return { competitionName, scorerName, convention: 'legacy' }
}

export function parseGoalFileName(fileName: string): ParsedGoalFileName | undefined {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  return parseCanonical(baseName) ?? parseLegacy(baseName)
}

export function buildGoalCompetition(format: GoalFormat, name: string): GoalCompetition {
  const slug = slugify(name)
  const type = resolveGoalCompetitionType(name)
  const base = { id: `${format}-${slug}`, slug, name, format, type } as const
  return type === 'official' ? { ...base, championshipId: `${format}-${slug}` } : base
}

export function buildGoalScorer(name: string): GoalScorer {
  const slug = slugify(name)
  return { id: slug, slug, name }
}

export function shortGoalHash(hash: string): string {
  return hash.slice(0, SHORT_HASH_LENGTH)
}

export function buildGoalId(format: GoalFormat, hash: string): string {
  return `${format}-${shortGoalHash(hash)}`
}

export function buildGoalPublicId(
  competition: GoalCompetition,
  scorer: GoalScorer,
  hash: string,
): string {
  return `solares/goals/${competition.format}/${competition.slug}/${scorer.slug}-${shortGoalHash(hash)}`
}
