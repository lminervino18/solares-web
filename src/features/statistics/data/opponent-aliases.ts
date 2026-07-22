import { applyAlias } from '../utils/applyAlias'

/**
 * Confirmed opponent (team) name aliases. Empty while the sheet spellings are
 * consistent. Never merge two opponents by partial similarity.
 */
export const OPPONENT_ALIASES: Readonly<Record<string, string>> = {}

export function canonicalOpponentName(name: string): string {
  return applyAlias(name, OPPONENT_ALIASES)
}
