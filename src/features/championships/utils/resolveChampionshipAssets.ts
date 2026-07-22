import { siteConfig } from '@/config/site.config'
import type { ChampionshipOverride } from '../data/championship-overrides'
import { getLeagueLogo, getTeamPhoto } from '../data/championship-assets'
import type { ChampionshipAssets, FootballFormat } from '../types/championships'
import { slugify } from './normalizeCellValue'

export type ResolveChampionshipAssetsParams = {
  readonly id: string
  readonly format: FootballFormat
  readonly name: string
  readonly league?: string
  readonly override?: ChampionshipOverride
}

const FORMAT_LABEL: Record<FootballFormat, string> = {
  f8: 'Fútbol 8',
  f5: 'Fútbol 5',
}

/**
 * Resolves the static media for a championship.
 *
 * Returns the team photo and league logo when they exist in the manifest, plus
 * accessible alt text. It never throws and does not require the championship to
 * be present in the manifest: a championship discovered from the spreadsheet
 * with no committed assets simply resolves to placeholders (undefined media).
 */
export function resolveChampionshipAssets(
  params: ResolveChampionshipAssetsParams,
): ChampionshipAssets {
  const { id, format, name, league, override } = params

  const teamPhoto = getTeamPhoto(id)
  const leagueSlug = league ? slugify(league) : undefined
  const logo = leagueSlug ? getLeagueLogo(leagueSlug) : undefined

  const assets: ChampionshipAssets = {
    ...(teamPhoto
      ? {
          teamPhoto: teamPhoto.src,
          teamPhotoWebp: teamPhoto.webp,
          teamPhotoWidth: teamPhoto.width,
          teamPhotoHeight: teamPhoto.height,
          teamPhotoAlt: `Plantel de ${siteConfig.teamName} en ${name} (${FORMAT_LABEL[format]})`,
        }
      : {}),
    ...(logo
      ? {
          tournamentLogo: logo.src,
          tournamentLogoAlt: league ? `Logo de ${league}` : `Logo del torneo`,
        }
      : {}),
    ...(override?.objectPosition ? { objectPosition: override.objectPosition } : {}),
  }

  return assets
}
