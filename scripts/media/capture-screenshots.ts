import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

import { chromium } from '@playwright/test'
import sharp from 'sharp'

const PREVIEW_URL = process.env.PREVIEW_URL ?? 'http://localhost:4173/'
const OUTPUT_PATH = 'docs/screenshots/home.png'

const VIEWPORT = { width: 1440, height: 900 }
const DEVICE_SCALE_FACTOR = 2

/** Stops before the kit banner so the image does not end mid-card. Re-check after a layout change. */
const CROP_HEIGHT = 1540

const OUTPUT_WIDTH = 1600

const SETTLE_MS = 1500

async function main(): Promise<void> {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: VIEWPORT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      // The crest spin and the section entrances would otherwise be caught
      // mid-flight and the capture would differ on every run.
      reducedMotion: 'reduce',
    })

    await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' })
    await page.waitForTimeout(SETTLE_MS)

    const raw = await page.screenshot()

    await mkdir(dirname(OUTPUT_PATH), { recursive: true })
    const metadata = await sharp(raw).metadata()
    await sharp(raw)
      .extract({
        left: 0,
        top: 0,
        width: metadata.width ?? VIEWPORT.width * DEVICE_SCALE_FACTOR,
        height: Math.min(CROP_HEIGHT, metadata.height ?? CROP_HEIGHT),
      })
      .resize({ width: OUTPUT_WIDTH })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(OUTPUT_PATH)

    console.log(`Wrote ${OUTPUT_PATH}`)
  } finally {
    await browser.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  console.error(`\nIs the preview server running at ${PREVIEW_URL}?`)
  console.error('Run "npm run build && npm run preview" in another terminal first.')
  process.exit(1)
})
