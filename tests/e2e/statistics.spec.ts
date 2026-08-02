import { test, expect, type Page } from '@playwright/test'

import { topScorerName } from './fixtures/snapshotChampionships'

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

test.describe('statistics', () => {
  test('opens F8 by default', async ({ page }) => {
    await page.goto('/estadisticas')
    await expect(page.getByRole('tab', { name: /F8/ })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: /F5/ })).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByRole('heading', { level: 1, name: 'Estadísticas' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Resumen histórico · Fútbol 8/ })).toBeVisible()
  })

  test('switches to F5 and updates the URL', async ({ page }) => {
    await page.goto('/estadisticas')
    await page.getByRole('tab', { name: /F5/ }).click()
    await expect(page).toHaveURL(/modalidad=f5/)
    await expect(page.getByRole('heading', { name: /Resumen histórico · Fútbol 5/ })).toBeVisible()
  })

  test('expands the full scorers table and filters by name', async ({ page }) => {
    const scorer = topScorerName('f8')
    test.skip(scorer === undefined, 'The snapshot has no F8 scorer')

    await page.goto('/estadisticas')
    await page.getByRole('button', { name: 'Ver tabla completa' }).click()
    const search = page.getByLabel('Buscar jugador')
    await expect(search).toBeVisible()

    await search.fill((scorer ?? '').split(' ')[0] ?? '')
    await expect(page.getByText(scorer ?? '').first()).toBeVisible()
  })

  test('renders a chart with an accessible data table', async ({ page }) => {
    await page.goto('/estadisticas')
    const toggle = page.getByRole('button', { name: 'Ver datos del gráfico' }).first()
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(
      page.getByRole('button', { name: 'Ocultar datos del gráfico' }).first(),
    ).toBeVisible()
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/estadisticas')
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

    await page.goto('/estadisticas')
    await expect(page.getByRole('heading', { name: /Resumen histórico/ })).toBeVisible()
    expect(errors).toEqual([])
  })
})
