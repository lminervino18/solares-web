import { slugify } from '@/features/championships/utils/normalizeCellValue'
import {
  canonicalGoalCompetitionName,
  resolveGoalCompetitionType,
} from '@/features/goals/data/goal-competition-aliases'
import { canonicalGoalScorerName } from '@/features/goals/data/goal-scorer-aliases'
import type { GoalCompetition, GoalFormat, GoalScorer } from '@/features/goals/types/goals'

/**
 * Deterministic parsing of local goal file names.
 *
 * Files are named `{Competition}_{Year}-{Scorer}-{index}`. The trailing index
 * only keeps sibling file names unique: it is never a goal number, a shirt
 * number or a date, so it is parsed and discarded. Four-digit years belong to
 * the competition name and are preserved.
 */

const FILE_NAME_PATTERN = /^([^-]+)-([^-]+)-(\d+)$/
const SHORT_HASH_LENGTH = 12

export type ParsedGoalFileName = {
  readonly competitionName: string
  readonly scorerName: string
}

export function parseGoalFileName(fileName: string): ParsedGoalFileName | undefined {
  const baseName = fileName.replace(/\.[^.]+$/, '')
  const match = FILE_NAME_PATTERN.exec(baseName)
  if (match === null) return undefined

  const [, rawCompetition, rawScorer] = match
  if (rawCompetition === undefined || rawScorer === undefined) return undefined

  const competitionName = canonicalGoalCompetitionName(rawCompetition)
  const scorerName = canonicalGoalScorerName(rawScorer)
  if (competitionName.length === 0 || scorerName.length === 0) return undefined

  return { competitionName, scorerName }
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
