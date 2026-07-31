import { test, expect, type Page } from '@playwright/test'

const fusionLabel = 'Cambalache más Solares da origen a Cambalares.'

async function altTexts(page: Page, groupName: string): Promise<string[]> {
  const group = page.getByRole('group', { name: groupName })
  await group.waitFor()
  return group
    .getByRole('img')
    .evaluateAll((images) => images.map((image) => image.getAttribute('alt') ?? ''))
}

async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const doc = document.documentElement
    return doc.scrollWidth > doc.clientWidth + 1
  })
}

test.describe('women and mixed', () => {
  test('loads with both sections and a single level-one heading', async ({ page }) => {
    await page.goto('/femenino-mixto')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Femenino y Mixto')
    await expect(page.getByRole('heading', { level: 2, name: 'Cambalache' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Cambalares' })).toBeVisible()
    expect(await hasHorizontalOverflow(page)).toBe(false)
  })

  test('the internal anchors move to each section', async ({ page }) => {
    await page.goto('/femenino-mixto')

    await page
      .getByRole('navigation', { name: 'Secciones de la página' })
      .getByRole('link', { name: 'Mixto' })
      .click()
    await expect(page).toHaveURL(/#mixto$/)
    await expect(page.locator('#mixto')).toBeInViewport()

    await page
      .getByRole('navigation', { name: 'Secciones de la página' })
      .getByRole('link', { name: 'Femenino' })
      .click()
    await expect(page).toHaveURL(/#femenino$/)
    await expect(page.locator('#femenino')).toBeInViewport()
  })

  test('shows the Cambalache crest and its complete flag', async ({ page }) => {
    await page.goto('/femenino-mixto')
    const section = page.locator('#femenino')

    const crest = section.getByRole('img', { name: /^Escudo de Cambalache/ })
    await expect(crest).toBeVisible()

    const flag = section.getByRole('img', { name: /^Bandera de Cambalache/ })
    await flag.scrollIntoViewIfNeeded()
    await expect(flag).toBeVisible()
    await expect
      .poll(() => flag.evaluate((image) => (image as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)

    const ratio = await flag.evaluate((image) => {
      const element = image as HTMLImageElement
      return {
        natural: element.naturalWidth / element.naturalHeight,
        rendered: element.clientWidth / element.clientHeight,
      }
    })
    expect(Math.abs(ratio.natural - ratio.rendered)).toBeLessThan(0.05)
  })

  test('shows the Cambalache photos, the coaches and the support for Solares in order', async ({
    page,
  }) => {
    await page.goto('/femenino-mixto')

    const team = await altTexts(page, 'Fotografías de Cambalache')
    expect(team).toHaveLength(4)
    expect(team.every((alt) => alt.length > 0)).toBe(true)

    const coaches = await altTexts(page, 'Directores técnicos de Cambalache')
    expect(coaches).toHaveLength(1)
    expect(coaches[0]).toMatch(/directores técnicos/i)

    const supporting = await altTexts(page, 'Cambalache alentando a Solares')
    expect(supporting).toHaveLength(2)
    expect(supporting.every((alt) => alt.includes('Solares'))).toBe(true)
  })

  test('composes Cambalache plus Solares into Cambalares', async ({ page }) => {
    await page.goto('/femenino-mixto')
    const fusion = page.getByRole('group', { name: fusionLabel })
    await fusion.scrollIntoViewIfNeeded()
    await expect(fusion).toBeVisible()

    const crests = await fusion
      .getByRole('img')
      .evaluateAll((images) => images.map((image) => image.getAttribute('alt') ?? ''))
    expect(crests).toHaveLength(3)
    expect(crests[0]).toMatch(/^Escudo de Cambalache/)
    expect(crests[1]).toMatch(/^Escudo actual de Solares/)
    expect(crests[2]).toMatch(/^Escudo de Cambalares/)

    for (const symbol of ['+', '=']) {
      await expect(fusion.getByText(symbol, { exact: true })).toHaveAttribute('aria-hidden', 'true')
    }
  })

  test('the crests answer to the pointer with a bounded rotation', async ({ page }) => {
    await page.goto('/femenino-mixto')
    const canHover = await page.evaluate(() => window.matchMedia('(hover: hover)').matches)
    test.skip(!canHover, 'The crest tilt follows a pointer, which touch devices do not have')

    const fusion = page.getByRole('group', { name: fusionLabel })
    await fusion.scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)

    const crest = fusion.getByRole('img', { name: /^Escudo de Cambalares/ })
    const box = await crest.boundingBox()
    expect(box).not.toBeNull()

    const readRotation = () =>
      crest.evaluate((image) => {
        const stage = image.closest('picture')?.parentElement?.parentElement
        return stage ? getComputedStyle(stage).transform : ''
      })

    const before = await readRotation()
    await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) * 0.9, (box?.y ?? 0) + 10)
    await page.waitForTimeout(700)
    const after = await readRotation()

    expect(before).not.toBe('')
    expect(after).not.toBe(before)
  })

  test('reduced motion keeps the composition static', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/femenino-mixto')

    const fusion = page.getByRole('group', { name: fusionLabel })
    await fusion.scrollIntoViewIfNeeded()
    await expect(fusion).toBeVisible()
    await expect(fusion.getByRole('img')).toHaveCount(3)

    const inlineStyles = await fusion.evaluate((element) =>
      [...element.children].map((child) => child.getAttribute('style')),
    )
    expect(inlineStyles.every((style) => style === null)).toBe(true)
    expect(await fusion.locator('[class*="perspective"]').count()).toBe(0)
  })

  test('shows the Cambalares photos in order and never mixes them with Cambalache', async ({
    page,
  }) => {
    await page.goto('/femenino-mixto')

    const photos = await altTexts(page, 'Fotografías de Cambalares')
    expect(photos).toHaveLength(5)
    expect(photos.every((alt) => alt.startsWith('Plantel mixto de Cambalares'))).toBe(true)

    const mixedSection = page.locator('#mixto')
    await expect(mixedSection.getByRole('img', { name: /^Plantel de Cambalache/ })).toHaveCount(0)
    await expect(
      page.locator('#femenino').getByRole('img', { name: /^Plantel mixto de Cambalares/ }),
    ).toHaveCount(0)
  })

  test('opens a photo in the lightbox, closes it with Escape and restores focus', async ({
    page,
  }) => {
    await page.goto('/femenino-mixto')

    const trigger = page
      .getByRole('group', { name: 'Fotografías de Cambalares' })
      .getByRole('button')
      .first()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()

    const lightbox = page.locator('.yarl__container')
    await expect(lightbox).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(lightbox).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('does not log unexpected console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text())
      }
    })
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/femenino-mixto')
    await page.getByRole('group', { name: fusionLabel }).scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(errors).toEqual([])
  })
})
