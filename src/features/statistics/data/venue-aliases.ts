import { applyAlias } from '../utils/applyAlias'

export const VENUE_ALIASES: Readonly<Record<string, string>> = {}

export function canonicalVenueName(name: string): string {
  return applyAlias(name, VENUE_ALIASES)
}
