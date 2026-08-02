import manifest from './generated/championship-assets.manifest.json'

/**
 * Resolves championship media without naming a single file.
 *
 * The generated manifest says which assets exist and what their intrinsic
 * dimensions are; `import.meta.glob` turns the manifest's relative paths into the
 * hashed URLs the bundler emits. Adding a championship photo or a league logo is
 * therefore a script run plus a commit — never an edit to this file.
 */

const ASSET_URLS = import.meta.glob<string>(
  '../../../assets/solares/championships/**/*.{jpg,webp,png}',
  { eager: true, import: 'default' },
)

const ASSET_BASE = '../../../assets/solares/championships/'

export type ChampionshipTeamPhoto = {
  readonly src: string
  readonly webp: string
  readonly width: number
  readonly height: number
}

export type ChampionshipLeagueLogo = {
  readonly src: string
}

function assetUrl(relativePath: string): string | undefined {
  return ASSET_URLS[`${ASSET_BASE}${relativePath}`]
}

export function getTeamPhoto(championshipId: string): ChampionshipTeamPhoto | undefined {
  const entry = manifest.teamPhotos[championshipId as keyof typeof manifest.teamPhotos]
  if (!entry) return undefined

  const src = assetUrl(entry.jpg)
  const webp = assetUrl(entry.webp)
  if (!src || !webp) return undefined

  return { src, webp, width: entry.width, height: entry.height }
}

export function getLeagueLogo(leagueSlug: string): ChampionshipLeagueLogo | undefined {
  const entry = manifest.leagueLogos[leagueSlug as keyof typeof manifest.leagueLogos]
  if (!entry) return undefined

  const src = assetUrl(entry.png)
  return src ? { src } : undefined
}
