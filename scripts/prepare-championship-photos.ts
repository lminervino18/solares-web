import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import sharp from 'sharp'

/**
 * Prepares championship team photos as `Picture`-ready assets.
 *
 * Each source photo is re-encoded to an optimized JPG and a WebP sibling at its
 * original dimensions (no crop, no face-cutting). Originals are never modified.
 * Idempotent: an existing pair is skipped unless `--force` is passed. Prints the
 * intrinsic width/height so the asset manifest can declare them.
 */

const SOURCE_DIR = 'campeonatos_archivos_solares'
const OUTPUT_DIR = 'src/assets/solares/championships'

type PhotoJob = {
  readonly source: string
  readonly format: 'f8' | 'f5'
  readonly slug: string
}

const PHOTOS: readonly PhotoJob[] = [
  { source: 'Apertura_2022.jpeg', format: 'f8', slug: 'apertura-2022' },
  { source: 'Clausura_2022.jpeg', format: 'f8', slug: 'clausura-2022' },
  { source: 'Apertura_2023.jpeg', format: 'f8', slug: 'apertura-2023' },
  { source: 'Clausura_2023.jpeg', format: 'f8', slug: 'clausura-2023' },
  { source: 'Apertura_2024.jpeg', format: 'f8', slug: 'apertura-2024' },
  { source: 'Clausura_2024.jpeg', format: 'f8', slug: 'clausura-2024' },
  { source: 'Apertura_2025.jpeg', format: 'f8', slug: 'apertura-2025' },
  { source: 'Clausura_2025.jpeg', format: 'f8', slug: 'clausura-2025' },
  { source: 'Clausura_2025_F5.jpeg', format: 'f5', slug: 'clausura-2025' },
  { source: 'Apertura_2026_F5.jpeg', format: 'f5', slug: 'apertura-2026' },
]

async function preparePhoto(
  job: PhotoJob,
  force: boolean,
): Promise<'done' | 'skipped' | 'missing'> {
  const sourcePath = join(SOURCE_DIR, job.source)
  const targetDir = join(OUTPUT_DIR, job.format, job.slug)
  const jpgPath = join(targetDir, 'team-photo.jpg')
  const webpPath = join(targetDir, 'team-photo.webp')

  if (!existsSync(sourcePath)) return 'missing'

  const meta = await sharp(sourcePath).metadata()
  console.log(`${job.format}/${job.slug}: ${meta.width}x${meta.height}`)

  if (existsSync(jpgPath) && existsSync(webpPath) && !force) return 'skipped'

  await mkdir(targetDir, { recursive: true })
  await sharp(sourcePath).jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath)
  await sharp(sourcePath).webp({ quality: 78 }).toFile(webpPath)
  return 'done'
}

async function main(): Promise<void> {
  const force = process.argv.includes('--force')
  let done = 0
  let skipped = 0
  let missing = 0

  for (const job of PHOTOS) {
    const result = await preparePhoto(job, force)
    if (result === 'done') done += 1
    else if (result === 'skipped') skipped += 1
    else {
      missing += 1
      console.warn(`missing source ${job.source}`)
    }
  }

  console.log(`\nphotos: ${done} written, ${skipped} skipped, ${missing} missing`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
