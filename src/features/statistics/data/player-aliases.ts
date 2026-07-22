import { applyAlias } from '../utils/applyAlias'

/**
 * Confirmed player name aliases, keyed by a normalized spelling and mapped to
 * the canonical display name. Empty while the sheet spellings are consistent.
 * Never merge players through fuzzy matching — only add confirmed entries here.
 */
export const PLAYER_ALIASES: Readonly<Record<string, string>> = {}

export function canonicalPlayerName(name: string): string {
  return applyAlias(name, PLAYER_ALIASES)
}
