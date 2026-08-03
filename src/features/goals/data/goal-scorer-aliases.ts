export const GOAL_SCORER_ALIASES: Readonly<Record<string, string>> = {
  'santiago penonori': 'Santiago Peñoñori',
}

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
