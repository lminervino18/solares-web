import { test, expect, type Page } from '@playwright/test'

// The gallery is exercised against the committed manifest with local stand-in
// media, so the suite never depends on a live Cloudinary account.
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
)

async function stubMedia(page: Page): Promise<void> {
  await page.route('**res.cloudinary.com/**', (route) => {
    const url = route.request().url()
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) {
      return route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL_PNG })
    }
    return route.fulfill({ status: 200, contentType: 'video/mp4', body: Buffer.alloc(0) })
  })
}

test.beforeEach(async ({ page }) => {
  await stubMedia(page)
})

const anyCard = /^Abrir gol de/
// The player shows side arrows on wide viewports and labelled buttons below the
// video on narrow ones, so the suite matches either wording.
const previousGoal = /^(Gol )?anterior$/i
const nextGoal = /^(Gol )?siguiente$/i

test.describe('goals', () => {
  test('opens F8 by default', async ({ page }) => {
    await page.goto('/goles')
    await expect(page.getByRole('tab', { name: /F8/ })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: /F5/ })).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByRole('heading', { level: 1, name: 'Goles' })).toBeVisible()
    await expect(page.getByRole('button', { name: anyCard }).first()).toBeVisible()
  })

  test('switching format updates the URL and the collection', async ({ page }) => {
    await page.goto('/goles')
    const f8Summary = await page
      .getByText(/^\d+ goles$/)
      .first()
      .innerText()

    await page.getByRole('tab', { name: /F5/ }).click()
    await expect(page).toHaveURL(/modalidad=f5/)
    await expect(page.getByText(/^\d+ goles$/).first()).not.toHaveText(f8Summary)

    await page.getByRole('tab', { name: /F8/ }).click()
    await expect(page).not.toHaveURL(/modalidad=f5/)
    await expect(page.getByText(/^\d+ goles$/).first()).toHaveText(f8Summary)
  })

  test('back and forward restore the format', async ({ page }) => {
    await page.goto('/goles')
    await page.getByRole('tab', { name: /F5/ }).click()
    await expect(page).toHaveURL(/modalidad=f5/)

    await page.goBack()
    await expect(page).not.toHaveURL(/modalidad=f5/)
    await page.goForward()
    await expect(page).toHaveURL(/modalidad=f5/)
  })

  test('filters by tournament and by scorer, and combines them', async ({ page }) => {
    await page.goto('/goles?torneo=apertura-2026')
    await expect(page.getByText(/\bgol(es)? en Apertura 2026$/)).toBeVisible()

    await page.goto('/goles?jugador=lorenzo-minervino')
    await expect(page.getByText(/\bgol(es)? de Lorenzo Minervino$/)).toBeVisible()

    await page.goto('/goles?torneo=apertura-2026&jugador=lorenzo-minervino')
    await expect(page.getByText(/de Lorenzo Minervino en Apertura 2026$/)).toBeVisible()
  })

  test('finds a scorer despite a typo', async ({ page }) => {
    await page.goto('/goles')
    await page.getByRole('button', { name: 'Goleador' }).click()
    await page.getByRole('combobox', { name: 'Buscar goleador' }).fill('Lrorenzo')
    await expect(page.getByRole('option', { name: /Lorenzo Minervino/ })).toBeVisible()
  })

  test('clears the filters without leaving the format', async ({ page }) => {
    await page.goto('/goles?jugador=lorenzo-minervino')
    await page.getByRole('button', { name: 'Limpiar filtros' }).click()
    await expect(page).not.toHaveURL(/jugador=/)
    await expect(page).not.toHaveURL(/modalidad=/)
  })

  test('opens a random goal from the filtered collection', async ({ page }) => {
    await page.goto('/goles?jugador=lorenzo-minervino')
    await page.getByRole('button', { name: /Ver un gol al azar/ }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Lorenzo Minervino')
  })

  test('changes the grid density', async ({ page }) => {
    await page.goto('/goles')
    await page.getByRole('radio', { name: /Compacta/ }).click()
    await expect(page.getByRole('radio', { name: /Compacta/ })).toHaveAttribute('data-state', 'on')
  })

  test('opens a goal, changes speed and zooms', async ({ page }) => {
    await page.goto('/goles')
    await page.getByRole('button', { name: anyCard }).first().click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(page).toHaveURL(/gol=/)

    await page.getByRole('button', { name: /^1x$/ }).click()
    await page.getByRole('menuitem', { name: '0.5x' }).click()
    await expect(page.getByRole('button', { name: /^0\.5x$/ })).toBeVisible()

    await expect(page.getByRole('button', { name: 'Alejar' })).toBeDisabled()
    await page.getByRole('button', { name: 'Acercar' }).click()
    await expect(page.getByRole('button', { name: 'Alejar' })).toBeEnabled()
    await expect(dialog.getByText('1.5x')).toBeVisible()
    await page.getByRole('button', { name: 'Restablecer el zoom' }).click()
    await expect(page.getByRole('button', { name: 'Alejar' })).toBeDisabled()
  })

  test('navigates with the arrows and respects the filters', async ({ page }) => {
    await page.goto('/goles?jugador=lorenzo-minervino')
    const summary = await page
      .getByText(/^\d+ goles/)
      .first()
      .innerText()
    const total = Number(summary.split(' ')[0])

    await page.getByRole('button', { name: anyCard }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toContainText(`Gol 1 de ${String(total)}`)
    await expect(page.getByRole('button', { name: previousGoal })).toBeDisabled()

    await page.getByRole('button', { name: nextGoal }).click()
    await expect(dialog).toContainText(`Gol 2 de ${String(total)}`)
    await expect(dialog).toContainText('Lorenzo Minervino')
  })

  test('reserves the video box so the player never resizes while loading', async ({ page }) => {
    // Delay the clip so the loading state is observable, then confirm the box
    // it occupies is already the one the video ends up in.
    await page.route('**res.cloudinary.com/**.mp4*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      await route.continue()
    })

    await page.goto('/goles')
    await page.getByRole('button', { name: anyCard }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    const stage = page.locator('[role="dialog"] video').locator('xpath=../..')
    await expect(page.getByRole('status')).toBeVisible()
    const whileLoading = await stage.boundingBox()

    await expect(page.getByRole('status')).toBeHidden({ timeout: 15_000 })
    const afterLoading = await stage.boundingBox()

    expect(whileLoading).not.toBeNull()
    expect(afterLoading).not.toBeNull()
    expect(Math.abs(whileLoading!.width - afterLoading!.width)).toBeLessThanOrEqual(1)
    expect(Math.abs(whileLoading!.height - afterLoading!.height)).toBeLessThanOrEqual(1)
  })

  test('keeps the reported duration stable while the clip plays', async ({ page }) => {
    await page.goto('/goles')
    await page.getByRole('button', { name: anyCard }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    const bar = page.locator('[role="dialog"] input[type=range]').first()
    const first = await bar.getAttribute('max')
    await page.waitForTimeout(1500)
    expect(await bar.getAttribute('max')).toBe(first)
  })

  test('opens a shared URL directly on the goal', async ({ page }) => {
    await page.goto('/goles')
    const firstCard = page.getByRole('button', { name: anyCard }).first()
    await expect(firstCard).toBeVisible()
    const goalName = (await firstCard.getAttribute('aria-label')) ?? ''

    await firstCard.click()
    await expect(page).toHaveURL(/gol=/)
    const sharedUrl = page.url()

    // The player preloads its clip, so waiting for `load` would wait for the
    // whole video. The assertion below is what actually decides the test.
    await page.goto(sharedUrl, { waitUntil: 'domcontentloaded' })
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    // The shared link must land on the same goal, not just on any player.
    expect(goalName).toContain(await dialog.getByRole('heading').first().innerText())
  })

  test('reports a goal that no longer exists without breaking the page', async ({ page }) => {
    await page.goto('/goles?gol=f8-noexiste')
    await expect(page.getByText('Ese gol ya no está disponible.')).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByRole('button', { name: anyCard }).first()).toBeVisible()
  })

  test('closes the player and keeps the filters', async ({ page }) => {
    await page.goto('/goles?jugador=lorenzo-minervino')
    await page.getByRole('button', { name: anyCard }).first().click()
    await page.getByRole('button', { name: 'Cerrar el reproductor' }).click()

    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page).not.toHaveURL(/gol=/)
    await expect(page).toHaveURL(/jugador=lorenzo-minervino/)
  })

  test('offers a download with a readable name', async ({ page }) => {
    await page.goto('/goles')
    await page.getByRole('button', { name: anyCard }).first().click()
    const link = page.getByRole('link', { name: /Descargar/ })
    await expect(link).toHaveAttribute('download', /^solares-f8-.+\.mp4$/)
  })

  test('reveals more goals on demand', async ({ page }) => {
    await page.goto('/goles')
    const before = await page.getByRole('button', { name: anyCard }).count()
    await page.getByRole('button', { name: 'Mostrar más goles' }).click()
    expect(await page.getByRole('button', { name: anyCard }).count()).toBeGreaterThan(before)
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/goles')
    await expect(page.getByRole('tablist')).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('logs no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/goles')
    await expect(page.getByRole('button', { name: anyCard }).first()).toBeVisible()
    expect(errors).toEqual([])
  })
})

test.describe('championship goals', () => {
  test('reuses the gallery inside a championship with goals', async ({ page }) => {
    await page.goto('/campeonatos?torneo=clausura-2023')
    const section = page.getByRole('region', { name: 'Goles grabados' })
    await expect(section).toBeVisible()
    await expect(section.getByRole('button', { name: anyCard }).first()).toBeVisible()
  })

  // Every published championship currently has goals, so the "no goals" case is
  // covered by the unit tests for ChampionshipGoals instead of here.
  test('shows only the goals of the selected championship', async ({ page }) => {
    await page.goto('/campeonatos?torneo=clausura-2022')
    const selected = await page.getByRole('heading', { level: 2 }).first().innerText()

    const section = page.getByRole('region', { name: 'Goles grabados' })
    await expect(section).toBeVisible()

    const cards = section.getByRole('button', { name: anyCard })
    await expect(cards.first()).toBeVisible()
    for (const name of await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('aria-label') ?? ''),
    )) {
      expect(name).toContain(selected)
    }
  })

  test('keeps the championship goals out of the query string', async ({ page }) => {
    await page.goto('/campeonatos?torneo=clausura-2023')
    const section = page.getByRole('region', { name: 'Goles grabados' })
    const card = section.getByRole('button', { name: anyCard }).first()
    await card.scrollIntoViewIfNeeded()
    await expect(card).toBeVisible()
    await card.click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page).not.toHaveURL(/gol=/)
    await expect(page).toHaveURL(/torneo=clausura-2023/)
  })
})
