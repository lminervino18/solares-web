export type ParsedSeason = {
  readonly season?: string
  readonly year?: number
  readonly recency: number
}

const SEASON_ORDER: Record<string, number> = {
  verano: 0,
  apertura: 1,
  clausura: 2,
}

/**
 * Extracts the season label and year from a championship name such as
 * `Apertura 2022`, `Clausura 2025` or `Verano 2026`.
 *
 * `recency` is a sortable weight where a larger value is more recent. Within a
 * year the Argentine calendar order is Verano < Apertura < Clausura. Names that
 * do not match keep a recency of 0 so they never outrank a dated championship.
 */
export function parseSeasonName(name: string): ParsedSeason {
  const yearMatch = /(20\d{2})/.exec(name)
  const year = yearMatch ? Number(yearMatch[1]) : undefined

  const lower = name.toLowerCase()
  let season: string | undefined
  let seasonWeight = 0
  for (const [key, weight] of Object.entries(SEASON_ORDER)) {
    if (lower.includes(key)) {
      season = key.charAt(0).toUpperCase() + key.slice(1)
      seasonWeight = weight
      break
    }
  }

  const recency = year ? year * 10 + seasonWeight : 0
  return {
    ...(season ? { season } : {}),
    ...(year !== undefined ? { year } : {}),
    recency,
  }
}
