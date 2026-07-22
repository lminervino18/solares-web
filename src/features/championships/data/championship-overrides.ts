import type { FootballFormat, TrophyTier } from '../types/championships'

/**
 * Optional editorial overrides for a single championship.
 *
 * Overrides only resolve ambiguity or add editorial polish; a new championship
 * appears correctly without one. Data such as matches, scorers, statistics and
 * results is never overridden here — it always comes from the spreadsheet.
 */
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

/**
 * Aliases that normalize alternative spellings of the same championship name
 * across sheets. Keyed by a normalized (lowercase, unaccented) source name and
 * mapped to the canonical spreadsheet name. Empty while every sheet agrees.
 */
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
