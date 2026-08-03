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

/** Kept out of the mappers: asset URLs are browser-only and must not enter the snapshot. */
export function enrichChampionshipsAssets(data: ChampionshipsByFormat): ChampionshipsByFormat {
  return {
    f8: data.f8.map(enrich),
    f5: data.f5.map(enrich),
  }
}
