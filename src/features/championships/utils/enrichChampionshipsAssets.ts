import { findChampionshipOverride } from '../data/championship-overrides'
import type { Championship, ChampionshipsByFormat } from '../types/championships'
import { resolveChampionshipAssets } from './resolveChampionshipAssets'

function enrich(championship: Championship): Championship {
  const override = findChampionshipOverride(championship.format, championship.name)
  const assets = resolveChampionshipAssets({
    id: championship.id,
    format: championship.format,
    name: championship.name,
    ...(championship.league ? { league: championship.league } : {}),
    ...(override ? { override } : {}),
  })
  return { ...championship, assets }
}

/**
 * Resolves static media for every championship at runtime.
 *
 * Kept separate from the pure data mappers because it imports build-time image
 * assets (browser only) and because asset URLs must not be baked into the
 * serialized snapshot. Applied to both the snapshot and remote data on load.
 */
export function enrichChampionshipsAssets(data: ChampionshipsByFormat): ChampionshipsByFormat {
  return {
    f8: data.f8.map(enrich),
    f5: data.f5.map(enrich),
  }
}
