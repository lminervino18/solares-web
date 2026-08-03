import { applyAlias } from '../utils/applyAlias'

export const OPPONENT_ALIASES: Readonly<Record<string, string>> = {}

export function canonicalOpponentName(name: string): string {
  return applyAlias(name, OPPONENT_ALIASES)
}
