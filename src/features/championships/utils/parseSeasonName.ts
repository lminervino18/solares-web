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

/** `recency` sorts newest first; within a year Verano < Apertura < Clausura. */
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
