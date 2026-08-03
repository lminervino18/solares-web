import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import sharp from 'sharp'

// Crests use a connectivity flood fill seeded from the border: only the outer
// background becomes transparent, so interior colors, text and shapes survive.

const SOURCE_DIR = 'nuevos_archvios_fem_y_mixto'
const OUTPUT_DIR = 'src/assets/solares'

type PhotoJob = {
  readonly source: string
  readonly target: string
}

type CrestJob = {
  readonly source: string
  readonly target: string
  readonly tolerance: number
}

const PHOTOS: readonly PhotoJob[] = [
  { source: 'solares_cipo_0.jpeg', target: 'history/photo-9' },
  { source: 'solares_cipo.jpeg', target: 'history/photo-10' },
  { source: 'bandera_camba.jpeg', target: 'cambalache/brand/flag' },
  { source: 'camba_1.jpeg', target: 'cambalache/team/team-1' },
  { source: 'camba_2.jpeg', target: 'cambalache/team/team-2' },
  { source: 'camba_3.jpeg', target: 'cambalache/team/team-3' },
  { source: 'camba_4.jpeg', target: 'cambalache/team/team-4' },
  { source: 'dts_camba.jpeg', target: 'cambalache/relationship/coaches' },
  { source: 'amigas_en_solares_1.jpeg', target: 'cambalache/relationship/supporting-solares-1' },
  { source: 'amigas_en_solares_2.jpeg', target: 'cambalache/relationship/supporting-solares-2' },
  { source: 'cambalares.jpeg', target: 'cambalares/team/team-1' },
  { source: 'cambalares_1.jpeg', target: 'cambalares/team/team-2' },
  { source: 'cambalares_2.jpeg', target: 'cambalares/team/team-3' },
  { source: 'cambalares_4.jpeg', target: 'cambalares/team/team-4' },
  { source: 'cambalares_6.jpeg', target: 'cambalares/team/team-5' },
  { source: 'cambalares_5.jpeg', target: 'cambalares/team/team-6' },
]

const CRESTS: readonly CrestJob[] = [
  { source: 'bandera_camba.jpeg', target: 'cambalache/brand/crest', tolerance: 34 },
  { source: 'cambalares_escudo.jpeg', target: 'cambalares/brand/crest', tolerance: 26 },
]

type Rgb = readonly [number, number, number]

function squaredDistance(pixels: Buffer, offset: number, color: Rgb): number {
  const dr = pixels[offset]! - color[0]
  const dg = pixels[offset + 1]! - color[1]
  const db = pixels[offset + 2]! - color[2]
  return dr * dr + dg * dg + db * db
}

function collectBorderColors(
  pixels: Buffer,
  width: number,
  height: number,
  tolerance: number,
): Rgb[] {
  const colors: Rgb[] = []
  const limit = tolerance * tolerance

  const consider = (x: number, y: number) => {
    const offset = (y * width + x) * 4
    if (colors.some((color) => squaredDistance(pixels, offset, color) <= limit)) return
    colors.push([pixels[offset]!, pixels[offset + 1]!, pixels[offset + 2]!])
  }

  for (let x = 0; x < width; x += 1) {
    consider(x, 0)
    consider(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    consider(0, y)
    consider(width - 1, y)
  }

  return colors
}

/** Interior areas sharing a border color stay opaque: the fill never reaches them. */
function findOuterBackground(
  pixels: Buffer,
  width: number,
  height: number,
  tolerance: number,
): Uint8Array {
  const backgroundColors = collectBorderColors(pixels, width, height, tolerance)
  const limit = tolerance * tolerance
  const isBackgroundColor = (index: number) => {
    const offset = index * 4
    return backgroundColors.some((color) => squaredDistance(pixels, offset, color) <= limit)
  }

  const background = new Uint8Array(width * height)
  const queue: number[] = []

  const push = (index: number) => {
    if (background[index] === 1 || !isBackgroundColor(index)) return
    background[index] = 1
    queue.push(index)
  }

  for (let x = 0; x < width; x += 1) {
    push(x)
    push((height - 1) * width + x)
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width)
    push(y * width + width - 1)
  }

  while (queue.length > 0) {
    const index = queue.pop()!
    const x = index % width
    const y = (index - x) / width
    if (x > 0) push(index - 1)
    if (x < width - 1) push(index + 1)
    if (y > 0) push(index - width)
    if (y < height - 1) push(index + width)
  }

  return background
}

async function extractCrest(
  job: CrestJob,
  force: boolean,
): Promise<'done' | 'skipped' | 'missing'> {
  const sourcePath = join(SOURCE_DIR, job.source)
  const pngPath = join(OUTPUT_DIR, `${job.target}.png`)
  const webpPath = join(OUTPUT_DIR, `${job.target}.webp`)

  if (!existsSync(sourcePath)) return 'missing'
  if (existsSync(pngPath) && existsSync(webpPath) && !force) return 'skipped'

  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info

  const background = findOuterBackground(data, width, height, job.tolerance)

  let left = width
  let right = -1
  let top = height
  let bottom = -1

  for (let index = 0; index < background.length; index += 1) {
    if (background[index] === 1) {
      data[index * 4 + 3] = 0
      continue
    }
    const x = index % width
    const y = (index - x) / width
    if (x < left) left = x
    if (x > right) right = x
    if (y < top) top = y
    if (y > bottom) bottom = y
  }

  if (right < left || bottom < top) {
    throw new Error(`no crest found in ${job.source}`)
  }

  const cropped = sharp(data, { raw: { width, height, channels: 4 } }).extract({
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  })

  await mkdir(dirname(pngPath), { recursive: true })
  await cropped.clone().png({ compressionLevel: 9 }).toFile(pngPath)
  await cropped.clone().webp({ lossless: true }).toFile(webpPath)

  console.log(
    `${job.target}: ${String(right - left + 1)}x${String(bottom - top + 1)} (from ${String(width)}x${String(height)})`,
  )
  return 'done'
}

async function preparePhoto(
  job: PhotoJob,
  force: boolean,
): Promise<'done' | 'skipped' | 'missing'> {
  const sourcePath = join(SOURCE_DIR, job.source)
  const jpgPath = join(OUTPUT_DIR, `${job.target}.jpg`)
  const webpPath = join(OUTPUT_DIR, `${job.target}.webp`)

  if (!existsSync(sourcePath)) return 'missing'

  const meta = await sharp(sourcePath).metadata()
  console.log(`${job.target}: ${String(meta.width)}x${String(meta.height)}`)

  if (existsSync(jpgPath) && existsSync(webpPath) && !force) return 'skipped'

  await mkdir(dirname(jpgPath), { recursive: true })
  await sharp(sourcePath).jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath)
  await sharp(sourcePath).webp({ quality: 78 }).toFile(webpPath)
  return 'done'
}

async function main(): Promise<void> {
  const force = process.argv.includes('--force')
  const counts = { done: 0, skipped: 0, missing: 0 }

  const track = (result: 'done' | 'skipped' | 'missing', source: string) => {
    counts[result] += 1
    if (result === 'missing') console.warn(`missing source ${source}`)
  }

  for (const job of PHOTOS) {
    track(await preparePhoto(job, force), job.source)
  }
  for (const job of CRESTS) {
    track(await extractCrest(job, force), job.source)
  }

  console.log(
    `\nassets: ${String(counts.done)} written, ${String(counts.skipped)} skipped, ${String(counts.missing)} missing`,
  )
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
