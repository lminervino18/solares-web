/**
 * Confirmed scorer name aliases, keyed by the normalized spelling found in a
 * source file name and mapped to the canonical display name.
 *
 * The local video files were exported with ASCII-only names, so accented names
 * lose their diacritics. Only add entries confirmed against the spreadsheet —
 * never merge scorers through fuzzy matching.
 */
export const GOAL_SCORER_ALIASES: Readonly<Record<string, string>> = {
  'santiago penonori': 'Santiago Peñoñori',
}

/**
 * Marker used in file names for goals scored by the opposing team. They are
 * real goals for Solares and keep their video, but they belong to no player.
 */
export const OWN_GOAL_SCORER_NAME = 'En contra'

const OWN_GOAL_MARKERS = new Set(['en contra', 'en_contra'])

export function isOwnGoalScorer(name: string): boolean {
  return OWN_GOAL_MARKERS.has(normalizeScorerKey(name))
}

export function normalizeScorerKey(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function canonicalGoalScorerName(rawName: string): string {
  const spaced = rawName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
  if (isOwnGoalScorer(spaced)) return OWN_GOAL_SCORER_NAME
  return GOAL_SCORER_ALIASES[normalizeScorerKey(spaced)] ?? spaced
}
