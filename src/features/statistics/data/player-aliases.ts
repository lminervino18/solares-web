import { applyAlias } from '../utils/applyAlias'

export const PLAYER_ALIASES: Readonly<Record<string, string>> = {}

export function canonicalPlayerName(name: string): string {
  return applyAlias(name, PLAYER_ALIASES)
}
