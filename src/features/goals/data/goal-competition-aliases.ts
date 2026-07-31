import type { GoalCompetitionType } from '../types/goals'

/**
 * Confirmed competition name aliases, keyed by a normalized spelling found in a
 * source file name and mapped to the canonical name used by the championships
 * data. Empty while every file name matches the spreadsheet spelling.
 */
export const GOAL_COMPETITION_ALIASES: Readonly<Record<string, string>> = {}

const FRIENDLY_PREFIX = 'amistoso'
const PRESEASON_PREFIX = 'pretemporada'
const OFFICIAL_SEASONS = ['apertura', 'clausura'] as const

export function normalizeCompetitionKey(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function canonicalGoalCompetitionName(rawName: string): string {
  const spaced = rawName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
  return GOAL_COMPETITION_ALIASES[normalizeCompetitionKey(spaced)] ?? spaced
}

export function resolveGoalCompetitionType(name: string): GoalCompetitionType {
  const key = normalizeCompetitionKey(name)
  if (key.startsWith(FRIENDLY_PREFIX)) return 'friendly'
  if (key.startsWith(PRESEASON_PREFIX)) return 'preseason'
  if (OFFICIAL_SEASONS.some((season) => key.startsWith(season))) return 'official'
  return 'other'
}
