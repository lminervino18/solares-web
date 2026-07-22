import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import sharp from 'sharp'

/**
 * Converts tournament logos to PNG without altering their design.
 *
 * The conversion is format-only: no resize, no crop, no background removal and
 * no recolouring. Existing alpha is preserved; no alpha is invented. Originals
 * in the source folder are never modified. The script is idempotent — an
 * already-converted target is skipped unless `--force` is passed.
 */

const SOURCE_DIR = 'campeonatos_archivos_solares'
const OUTPUT_DIR = 'src/assets/solares/championships/logos'

type LogoJob = {
  readonly source: string
  readonly target: string
}

const LOGOS: readonly LogoJob[] = [
  { source: 'DePrimera.jpeg', target: 'deprimera.png' },
  { source: 'TdeA.jpeg', target: 'tdea.png' },
  { source: 'Torneos_Indiana.jpeg.png', target: 'torneos-indiana.png' },
]

async function convertLogo(
  job: LogoJob,
  force: boolean,
): Promise<'converted' | 'skipped' | 'missing'> {
  const sourcePath = join(SOURCE_DIR, job.source)
  const targetPath = join(OUTPUT_DIR, job.target)

  if (!existsSync(sourcePath)) return 'missing'
  if (existsSync(targetPath) && !force) return 'skipped'

  await mkdir(dirname(targetPath), { recursive: true })
  await sharp(sourcePath).png({ compressionLevel: 9 }).toFile(targetPath)
  return 'converted'
}

async function main(): Promise<void> {
  const force = process.argv.includes('--force')
  let converted = 0
  let skipped = 0
  let missing = 0

  for (const job of LOGOS) {
    const result = await convertLogo(job, force)
    if (result === 'converted') {
      converted += 1
      console.log(`converted ${job.source} -> ${job.target}`)
    } else if (result === 'skipped') {
      skipped += 1
      console.log(`skipped ${job.target} (already exists)`)
    } else {
      missing += 1
      console.warn(`missing source ${job.source}`)
    }
  }

  console.log(`\nlogos: ${converted} converted, ${skipped} skipped, ${missing} missing`)
  if (missing > 0) {
    console.warn('Some source logos were not found. Add them to the source folder and re-run.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
