import type { ChampionshipHonorType, TrophyTier } from '../types/championships'

export type ChampionshipHonor = {
  readonly honorType: ChampionshipHonorType
  readonly trophyTier: TrophyTier
}

const UNKNOWN: ChampionshipHonor = { honorType: 'unknown', trophyTier: 'none' }

/**
 * Maps a spreadsheet result label to a championship honor and trophy tier.
 *
 * Editorial convention (confirmed with the club): the "Plata" (silver) bracket
 * is always explicit, so an unqualified `Campeón` / `Finalista` belongs to the
 * gold bracket. Only `Campeón` and `Campeón Plata` award a trophy tier;
 * finalists are runners-up without a cup.
 */
export function mapChampionshipHonor(resultLabel: string | undefined): ChampionshipHonor {
  if (!resultLabel) return UNKNOWN

  const value = resultLabel.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

  const isSilver = value.includes('plata')

  if (value.includes('campeon')) {
    return isSilver
      ? { honorType: 'silver-champion', trophyTier: 'silver' }
      : { honorType: 'gold-champion', trophyTier: 'gold' }
  }

  // "semifinalista" contains "finalista", so it must be matched first.
  if (value.includes('semifinal')) {
    return { honorType: 'semifinalist', trophyTier: 'none' }
  }

  if (value.includes('cuarto')) {
    return { honorType: 'quarterfinalist', trophyTier: 'none' }
  }

  if (value.includes('finalista') || value.includes('subcampeon')) {
    return isSilver
      ? { honorType: 'silver-runner-up', trophyTier: 'none' }
      : { honorType: 'gold-runner-up', trophyTier: 'none' }
  }

  if (value.includes('grupo')) {
    return { honorType: 'group-stage', trophyTier: 'none' }
  }

  return { honorType: 'other', trophyTier: 'none' }
}
