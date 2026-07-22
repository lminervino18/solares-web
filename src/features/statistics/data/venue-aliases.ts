import { applyAlias } from '../utils/applyAlias'

/**
 * Confirmed venue (Sede) name aliases. Empty while the sheet spellings are
 * consistent. Do not merge venues automatically.
 */
export const VENUE_ALIASES: Readonly<Record<string, string>> = {}

export function canonicalVenueName(name: string): string {
  return applyAlias(name, VENUE_ALIASES)
}
