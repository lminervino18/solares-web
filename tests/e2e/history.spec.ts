import { test, expect } from '@playwright/test'

test.describe('history', () => {
  test('keeps the four renaissance photos in order', async ({ page }) => {
    await page.goto('/historia')

    const chapter = page.locator('#el-renacimiento')
    await expect(chapter.getByRole('heading', { level: 2 })).toHaveText('El renacimiento')

    const gallery = chapter.getByRole('group', { name: /^Galería del capítulo/ })
    await gallery.scrollIntoViewIfNeeded()

    const images = gallery.getByRole('img')
    await expect(images).toHaveCount(4)

    const alternativeTexts = await images.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('alt') ?? ''),
    )
    expect(alternativeTexts[0]).toContain('cancha de fútbol techada')
    expect(alternativeTexts[1]).toContain('cancha sintética durante la noche')
    expect(alternativeTexts[2]).toContain('frente al arco')
    expect(alternativeTexts[3]).toContain('Campeón 2021')

    const tops = await images.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    )
    expect(tops[0]).toBeLessThanOrEqual(tops[2] ?? 0)
    expect(tops[1]).toBeLessThanOrEqual(tops[3] ?? 0)
  })

  test('has no horizontal overflow on the history page', async ({ page }) => {
    await page.goto('/historia')
    const hasOverflow = await page.evaluate(() => {
      const doc = document.documentElement
      return doc.scrollWidth > doc.clientWidth + 1
    })
    expect(hasOverflow).toBe(false)
  })
})
