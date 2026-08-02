import { test, expect, type Page } from '@playwright/test'

import {
  defaultChampionship,
  exclusiveChampionshipName,
  secondChampionship,
} from './fixtures/snapshotChampionships'

// Serve a deterministic, offline experience: the gviz endpoint returns an error
// payload so the app keeps rendering the committed snapshot. This avoids relying
// on live Google Sheets and keeps the tests stable.
const STUB_RESPONSE =
  'google.visualization.Query.setResponse({"status":"error","errors":[{"message":"stubbed"}]});'

async function stubSheets(page: Page): Promise<void> {
  await page.route('**/gviz/tq**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: STUB_RESPONSE }),
  )
}

test.beforeEach(async ({ page }) => {
  await stubSheets(page)
})

test.describe('championships', () => {
  test('opens F8 by default', async ({ page }) => {
    await page.goto('/campeonatos')
    await expect(page.getByRole('tab', { name: /F8/ })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: /F5/ })).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByRole('heading', { level: 1, name: 'Campeonatos' })).toBeVisible()
  })

  test('switching format updates the URL and the content', async ({ page }) => {
    await page.goto('/campeonatos')
    await expect(page.getByText('Campeonatos F8')).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 2, name: defaultChampionship('f8').name }),
    ).toBeVisible()

    await page.getByRole('tab', { name: /F5/ }).click()
    await expect(page).toHaveURL(/modalidad=f5/)
    // A championship name can exist in both formats, so the spotlight label is
    // what proves the format changed.
    await expect(page.getByText('Campeonatos F5')).toBeVisible()

    const f8Only = exclusiveChampionshipName('f8', 'f5')
    if (f8Only) await expect(page.getByText(f8Only)).toHaveCount(0)

    await page.getByRole('tab', { name: /F8/ }).click()
    await expect(page).not.toHaveURL(/modalidad=f5/)
    await expect(page.getByText('Campeonatos F8')).toBeVisible()
  })

  test('selecting a championship updates the torneo param and back restores it', async ({
    page,
  }) => {
    const first = defaultChampionship('f8')
    await page.goto('/campeonatos')
    await expect(page.getByRole('heading', { level: 2, name: first.name })).toBeVisible()

    await page.getByRole('button', { name: 'Campeonato siguiente' }).click()
    await expect(page).toHaveURL(/torneo=/)

    await page.goBack()
    await expect(page).not.toHaveURL(/torneo=/)
    await expect(page.getByRole('heading', { level: 2, name: first.name })).toBeVisible()
  })

  test('selects a non-default F5 championship from the carousel', async ({ page }) => {
    const target = secondChampionship('f5')
    test.skip(target === undefined, 'The snapshot has a single published F5 championship')

    await page.goto('/campeonatos?modalidad=f5')
    await expect(
      page.getByRole('heading', { level: 2, name: defaultChampionship('f5').name }),
    ).toBeVisible()

    await page
      .getByRole('button', { name: new RegExp(target?.name ?? '') })
      .first()
      .click()
    await expect(page).toHaveURL(new RegExp(`torneo=${target?.slug ?? ''}`))
    await expect(page.getByRole('heading', { level: 2, name: target?.name ?? '' })).toBeVisible()
  })

  test('changes championship with the keyboard arrows without selecting a card', async ({
    page,
  }) => {
    const first = defaultChampionship('f8')
    const second = secondChampionship('f8')
    test.skip(second === undefined, 'The snapshot has a single published F8 championship')

    await page.goto('/campeonatos')
    await expect(page.getByRole('heading', { level: 2, name: first.name })).toBeVisible()

    // No card is focused; the arrows still change the championship.
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('heading', { level: 2, name: second?.name ?? '' })).toBeVisible()

    await page.keyboard.press('ArrowLeft')
    await expect(page.getByRole('heading', { level: 2, name: first.name })).toBeVisible()
  })

  test('keeps the scroll position when switching championships', async ({ page }) => {
    await page.goto('/campeonatos')
    await expect(
      page.getByRole('heading', { level: 2, name: defaultChampionship('f8').name }),
    ).toBeVisible()

    // Click via the DOM so Playwright does not auto-scroll the button into view,
    // which would move the page itself and mask the behaviour under test.
    await page.evaluate(() => {
      window.scrollTo(0, 600)
      const button = [...document.querySelectorAll('button')].find(
        (element) => element.getAttribute('aria-label') === 'Campeonato siguiente',
      )
      button?.click()
    })

    await expect(page).toHaveURL(/torneo=/)
    // The page keeps its position (settling to the target) instead of jumping to
    // the top; a reset would leave scrollY at 0.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300)
  })

  test('reveals a match goalscorers on interaction', async ({ page }) => {
    await page.goto('/campeonatos')
    const row = page.getByRole('button', { name: /Goleadores contra/ }).first()
    await expect(row).toBeVisible()
    await row.click()
    await expect(row).toHaveAttribute('aria-expanded', 'true')
  })

  test('reveals all matches on demand', async ({ page }) => {
    await page.goto('/campeonatos')
    const toggle = page.getByRole('button', { name: 'Ver todos los partidos' })
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(page.getByRole('button', { name: 'Mostrar menos' }).first()).toBeVisible()
  })

  test('renders from the snapshot when the sheet is unavailable', async ({ page }) => {
    await page.goto('/campeonatos')
    await expect(page.getByText('Mostrando la última versión disponible.')).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 2, name: defaultChampionship('f8').name }),
    ).toBeVisible()
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/campeonatos')
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

    await page.goto('/campeonatos')
    await expect(page.getByRole('tablist')).toBeVisible()
    expect(errors).toEqual([])
  })
})
