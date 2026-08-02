import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, extname } from 'node:path'

import { chromium } from '@playwright/test'
import sharp from 'sharp'

/**
 * Renders the Open Graph card shared on WhatsApp, Instagram and X.
 *
 * Composed rather than screenshotted: a social card is displayed a few hundred
 * pixels wide, where page text is unreadable. Rendered through a headless
 * browser so it uses the real brand fonts and the design tokens instead of
 * re-declaring the palette here.
 *
 * The output is committed under `public/` because a crawler needs an absolute,
 * static URL and never executes JavaScript.
 */

const OUTPUT_PATH = 'public/og-image.png'

/** The size every social platform crops from. */
const WIDTH = 1200
const HEIGHT = 630

const CREST_PATH = 'src/assets/solares/brand/current-crest.png'
const DISPLAY_FONT =
  'node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2'
const BODY_FONT = 'node_modules/@fontsource/barlow/files/barlow-latin-500-normal.woff2'

const TEAM_NAME = 'Solares'
const TAGLINE = 'El Torito Violeta'
const DOMAIN = 'solaresfutbol.com'

const MIME: Readonly<Record<string, string>> = {
  '.png': 'image/png',
  '.woff2': 'font/woff2',
}

async function dataUri(path: string): Promise<string> {
  const buffer = await readFile(path)
  const mime = MIME[extname(path)] ?? 'application/octet-stream'
  return `data:${mime};base64,${buffer.toString('base64')}`
}

function buildHtml(crest: string, displayFont: string, bodyFont: string): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: 'Barlow Condensed';
        src: url('${displayFont}') format('woff2');
        font-weight: 700;
      }
      @font-face {
        font-family: 'Barlow';
        src: url('${bodyFont}') format('woff2');
        font-weight: 500;
      }

      :root {
        --canvas: #070609;
        --violet-950: #25064f;
        --violet-500: #873fff;
        --violet-300: #c2a3ff;
        --white: #ffffff;
        --neutral-300: #b7b5bf;
      }

      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        display: flex;
        align-items: center;
        gap: 64px;
        padding: 0 88px;
        background:
          radial-gradient(circle at 74% 50%, color-mix(in oklab, var(--violet-500) 26%, transparent) 0%, transparent 58%),
          linear-gradient(135deg, var(--violet-950) 0%, var(--canvas) 62%);
        color: var(--white);
        overflow: hidden;
      }

      .copy { flex: 1; min-width: 0; }

      .eyebrow {
        font-family: 'Barlow', sans-serif;
        font-weight: 500;
        font-size: 26px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--violet-300);
        margin-bottom: 18px;
      }

      .name {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 168px;
        line-height: 0.86;
        letter-spacing: -0.015em;
      }

      .tagline {
        font-family: 'Barlow', sans-serif;
        font-weight: 500;
        font-size: 38px;
        color: var(--neutral-300);
        margin-top: 26px;
      }

      .rule {
        width: 132px;
        height: 6px;
        border-radius: 3px;
        background: var(--violet-500);
        margin-top: 38px;
      }

      .crest {
        width: 430px;
        height: 430px;
        object-fit: contain;
        flex-shrink: 0;
        filter: drop-shadow(0 26px 60px rgba(0, 0, 0, 0.55));
      }
    </style>
  </head>
  <body>
    <div class="copy">
      <p class="eyebrow">${DOMAIN}</p>
      <h1 class="name">${TEAM_NAME}</h1>
      <p class="tagline">${TAGLINE}</p>
      <div class="rule"></div>
    </div>
    <img class="crest" src="${crest}" alt="" />
  </body>
</html>`
}

async function main(): Promise<void> {
  const [crest, displayFont, bodyFont] = await Promise.all([
    dataUri(CREST_PATH),
    dataUri(DISPLAY_FONT),
    dataUri(BODY_FONT),
  ])

  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    })
    await page.setContent(buildHtml(crest, displayFont, bodyFont), { waitUntil: 'load' })
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const png = await page.screenshot({ type: 'png' })
    await mkdir(dirname(OUTPUT_PATH), { recursive: true })

    // Palette quantization: the card is a flat gradient plus the crest, so 256
    // colours are indistinguishable and keep the file small enough for the
    // crawlers that give up on a slow fetch.
    const optimized = await sharp(png)
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toBuffer()
    await writeFile(OUTPUT_PATH, optimized)

    const kb = Math.round(optimized.byteLength / 1024)
    console.log(`Wrote ${OUTPUT_PATH} (${WIDTH}x${HEIGHT}, ${kb} KB)`)
  } finally {
    await browser.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
