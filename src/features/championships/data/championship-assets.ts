import manifest from './generated/championship-assets.manifest.json'

/** `import.meta.glob` resolves the manifest's relative paths to hashed bundle URLs. */
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
