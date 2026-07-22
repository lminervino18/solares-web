import { test, expect } from '@playwright/test'

const widths = [320, 360, 375, 390, 412, 768, 1024, 1280, 1440]
const paths = ['/', '/campeonatos', '/estadisticas', '/goles', '/femenino-mixto']

test.describe('responsive layout', () => {
  for (const width of widths) {
    test(`has no horizontal overflow at ${String(width)}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })

      for (const path of paths) {
        await page.goto(path)
        const hasOverflow = await page.evaluate(() => {
          const doc = document.documentElement
          return doc.scrollWidth > doc.clientWidth + 1
        })
        expect(hasOverflow, `overflow at ${path}`).toBe(false)
      }
    })
  }
})
