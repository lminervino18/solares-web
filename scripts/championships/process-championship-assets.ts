import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { mkdir, readdir } from 'node:fs/promises'
import { basename, dirname, extname, join } from 'node:path'

import sharp from 'sharp'

import { FOOTBALL_FORMATS, type FootballFormat } from '@/config/football-format'
import { loadChampionshipsSnapshot } from '@/features/championships/data/championshipsSnapshot'
import { slugify } from '@/features/championships/utils/normalizeCellValue'

const INTAKE_DIR = 'content/incoming/championships'
const OUTPUT_DIR = 'src/assets/solares/championships'
const LOGO_DIR = join(OUTPUT_DIR, 'logos')
const MANIFEST_PATH = 'src/features/championships/data/generated/championship-assets.manifest.json'

const TEAM_PHOTO_STEM = 'team-photo'
const TOURNAMENT_LOGO_STEM = 'tournament-logo'
const SUPPORTED_INPUT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'])

const JPEG_QUALITY = 82
const WEBP_QUALITY = 78
const PNG_COMPRESSION_LEVEL = 9

type TeamPhotoEntry = {
  readonly championshipId: string
  readonly format: FootballFormat
  readonly slug: string
  readonly jpg: string
  readonly webp: string
  readonly width: number
  readonly height: number
  readonly aspectRatio: number
}

type LeagueLogoEntry = {
  readonly leagueSlug: string
  readonly png: string
  readonly width: number
  readonly height: number
}

type ChampionshipAssetsManifest = {
  readonly teamPhotos: Readonly<Record<string, TeamPhotoEntry>>
  readonly leagueLogos: Readonly<Record<string, LeagueLogoEntry>>
}

type KnownChampionship = {
  readonly id: string
  readonly format: FootballFormat
  readonly slug: string
  readonly name: string
  readonly leagueSlug?: string
  readonly leagueName?: string
}

type Report = {
  readonly encoded: string[]
  readonly skipped: string[]
  readonly errors: string[]
  readonly notes: string[]
}

function loadKnownChampionships(): readonly KnownChampionship[] {
  const { data } = loadChampionshipsSnapshot()
  return [...data.f8, ...data.f5].map((championship) => ({
    id: championship.id,
    format: championship.format,
    slug: championship.slug,
    name: championship.name,
    ...(championship.league
      ? { leagueSlug: slugify(championship.league), leagueName: championship.league }
      : {}),
  }))
}

async function listIntakeFolders(format: FootballFormat): Promise<readonly string[]> {
  const directory = join(INTAKE_DIR, format)
  if (!existsSync(directory)) return []
  const entries = await readdir(directory, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

async function findSourceFile(directory: string, stem: string): Promise<string | undefined> {
  const entries = await readdir(directory, { withFileTypes: true })
  const matches = entries
    .filter((entry) => entry.isFile() && basename(entry.name, extname(entry.name)) === stem)
    .filter((entry) => SUPPORTED_INPUT.has(extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort()
  return matches[0]
}

async function encodeTeamPhoto(
  sourcePath: string,
  format: FootballFormat,
  slug: string,
  force: boolean,
  report: Report,
): Promise<void> {
  const targetDir = join(OUTPUT_DIR, format, slug)
  const jpgPath = join(targetDir, `${TEAM_PHOTO_STEM}.jpg`)
  const webpPath = join(targetDir, `${TEAM_PHOTO_STEM}.webp`)

  if (existsSync(jpgPath) && existsSync(webpPath) && !force) {
    report.skipped.push(`${format}/${slug} team photo (already encoded)`)
    return
  }

  await mkdir(targetDir, { recursive: true })
  await sharp(sourcePath).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(jpgPath)
  await sharp(sourcePath).webp({ quality: WEBP_QUALITY }).toFile(webpPath)
  report.encoded.push(`${format}/${slug} team photo`)
}

// A tournament logo belongs to the championship's league, which several
// championships share: one per league, and a conflicting second one is
// reported instead of silently winning.
async function encodeTournamentLogo(
  sourcePath: string,
  leagueSlug: string,
  force: boolean,
  report: Report,
): Promise<void> {
  const targetPath = join(LOGO_DIR, `${leagueSlug}.png`)

  if (existsSync(targetPath) && !force) {
    report.skipped.push(`league ${leagueSlug} logo (already converted)`)
    return
  }

  await mkdir(LOGO_DIR, { recursive: true })
  await sharp(sourcePath).png({ compressionLevel: PNG_COMPRESSION_LEVEL }).toFile(targetPath)
  report.encoded.push(`league ${leagueSlug} logo`)
}

async function processIntake(
  known: readonly KnownChampionship[],
  force: boolean,
  report: Report,
): Promise<void> {
  if (!existsSync(INTAKE_DIR)) return

  const claimedLogos = new Map<string, string>()

  for (const format of FOOTBALL_FORMATS) {
    for (const slug of await listIntakeFolders(format)) {
      const championship = known.find(
        (candidate) => candidate.format === format && candidate.slug === slug,
      )

      if (!championship) {
        report.errors.push(
          `${format}/${slug}: no championship with that slug exists in ${format.toUpperCase()}. ` +
            `Check the spelling against the spreadsheet, or run the sync first. Nothing was copied.`,
        )
        continue
      }

      const directory = join(INTAKE_DIR, format, slug)
      const photoSource = await findSourceFile(directory, TEAM_PHOTO_STEM)
      const logoSource = await findSourceFile(directory, TOURNAMENT_LOGO_STEM)

      if (!photoSource && !logoSource) {
        report.notes.push(`${format}/${slug}: folder is empty, nothing to process.`)
        continue
      }

      if (photoSource) {
        await encodeTeamPhoto(join(directory, photoSource), format, slug, force, report)
      }

      if (logoSource) {
        if (!championship.leagueSlug) {
          report.errors.push(
            `${format}/${slug}: the championship has no league ("Torneo" column) in the ` +
              `spreadsheet, so the tournament logo cannot be attached. Logo not copied.`,
          )
          continue
        }

        const claimedBy = claimedLogos.get(championship.leagueSlug)
        if (claimedBy && claimedBy !== `${format}/${slug}`) {
          report.errors.push(
            `${format}/${slug}: league "${championship.leagueName}" already received a logo ` +
              `from ${claimedBy} in this run. Keep only one. Logo not copied.`,
          )
          continue
        }

        claimedLogos.set(championship.leagueSlug, `${format}/${slug}`)
        await encodeTournamentLogo(
          join(directory, logoSource),
          championship.leagueSlug,
          force,
          report,
        )
        report.notes.push(
          `${format}/${slug}: the logo was published for the league ` +
            `"${championship.leagueName}", which every championship of that league shares.`,
        )
      }
    }
  }
}

async function buildManifest(
  known: readonly KnownChampionship[],
): Promise<ChampionshipAssetsManifest> {
  const teamPhotos: Record<string, TeamPhotoEntry> = {}
  const leagueLogos: Record<string, LeagueLogoEntry> = {}

  for (const championship of [...known].sort((a, b) => a.id.localeCompare(b.id))) {
    const relativeDir = `${championship.format}/${championship.slug}`
    const jpgPath = join(OUTPUT_DIR, relativeDir, `${TEAM_PHOTO_STEM}.jpg`)
    const webpPath = join(OUTPUT_DIR, relativeDir, `${TEAM_PHOTO_STEM}.webp`)
    if (!existsSync(jpgPath) || !existsSync(webpPath)) continue

    const meta = await sharp(jpgPath).metadata()
    if (!meta.width || !meta.height) continue

    teamPhotos[championship.id] = {
      championshipId: championship.id,
      format: championship.format,
      slug: championship.slug,
      jpg: `${relativeDir}/${TEAM_PHOTO_STEM}.jpg`,
      webp: `${relativeDir}/${TEAM_PHOTO_STEM}.webp`,
      width: meta.width,
      height: meta.height,
      aspectRatio: Number((meta.width / meta.height).toFixed(4)),
    }
  }

  const leagueSlugs = [
    ...new Set(known.map((c) => c.leagueSlug).filter((slug): slug is string => Boolean(slug))),
  ].sort()

  for (const leagueSlug of leagueSlugs) {
    const pngPath = join(LOGO_DIR, `${leagueSlug}.png`)
    if (!existsSync(pngPath)) continue
    const meta = await sharp(pngPath).metadata()
    if (!meta.width || !meta.height) continue
    leagueLogos[leagueSlug] = {
      leagueSlug,
      png: `logos/${leagueSlug}.png`,
      width: meta.width,
      height: meta.height,
    }
  }

  return { teamPhotos, leagueLogos }
}

function serialize(manifest: ChampionshipAssetsManifest): string {
  return `${JSON.stringify(manifest, null, 2)}\n`
}

function printReport(report: Report, manifest: ChampionshipAssetsManifest): void {
  for (const line of report.encoded) console.log(`encoded  ${line}`)
  for (const line of report.skipped) console.log(`skipped  ${line}`)
  for (const line of report.notes) console.log(`note     ${line}`)
  for (const line of report.errors) console.error(`error    ${line}`)

  const photos = Object.keys(manifest.teamPhotos).length
  const logos = Object.keys(manifest.leagueLogos).length
  console.log(`\nmanifest: ${photos} team photos, ${logos} league logos`)
}

async function main(): Promise<void> {
  const check = process.argv.includes('--check')
  const force = process.argv.includes('--force')

  const known = loadKnownChampionships()
  if (known.length === 0) {
    console.error('No championships found in the snapshot. Run "npm run championships:sync" first.')
    process.exit(1)
    return
  }

  const report: Report = { encoded: [], skipped: [], errors: [], notes: [] }

  if (!check) {
    await processIntake(known, force, report)
  }

  const manifest = await buildManifest(known)
  const output = serialize(manifest)

  if (check) {
    if (!existsSync(MANIFEST_PATH)) {
      console.error('No asset manifest found. Run "npm run championships:assets".')
      process.exit(1)
      return
    }
    const current = readFileSync(MANIFEST_PATH, 'utf-8')
    if (current !== output) {
      console.error('Championship asset manifest is stale. Run "npm run championships:assets".')
      process.exit(1)
      return
    }
    const pendingIntake = existsSync(INTAKE_DIR)
      ? (
          await Promise.all(
            FOOTBALL_FORMATS.map(async (format) => (await listIntakeFolders(format)).length),
          )
        ).reduce((total, count) => total + count, 0)
      : 0
    console.log(`Championship asset manifest is up to date. ${pendingIntake} intake folders found.`)
    return
  }

  await mkdir(dirname(MANIFEST_PATH), { recursive: true })
  writeFileSync(MANIFEST_PATH, output)
  printReport(report, manifest)

  if (report.errors.length > 0) {
    console.error(`\n${report.errors.length} problem(s) above were not processed.`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
