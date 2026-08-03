import type { FootballFormat, TrophyTier } from '../types/championships'

export type ChampionshipOverride = {
  readonly format: FootballFormat
  readonly name: string
  readonly shortName?: string
  readonly order?: number
  readonly trophyTier?: TrophyTier
  readonly objectPosition?: string
  readonly videoUrl?: string
  readonly note?: string
}

export const CHAMPIONSHIP_ALIASES: Readonly<Record<string, string>> = {}

export const CHAMPIONSHIP_OVERRIDES: readonly ChampionshipOverride[] = []

export function findChampionshipOverride(
  format: FootballFormat,
  name: string,
): ChampionshipOverride | undefined {
  const target = name.trim().toLowerCase()
  return CHAMPIONSHIP_OVERRIDES.find(
    (override) => override.format === format && override.name.trim().toLowerCase() === target,
  )
}
