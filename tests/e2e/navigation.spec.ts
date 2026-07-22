import { test, expect } from '@playwright/test'

const routes = [
  { path: '/', heading: 'Solares' },
  { path: '/campeonatos', heading: 'Campeonatos' },
  { path: '/estadisticas', heading: 'Estadísticas' },
  { path: '/goles', heading: 'Goles' },
  { path: '/femenino-mixto', heading: 'Femenino y Mixto' },
]

test.describe('routing', () => {
  for (const route of routes) {
    test(`loads ${route.path}`, async ({ page }) => {
      await page.goto(route.path)
      await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible()
    })
  }

  test('shows the 404 page on an unknown route', async ({ page }) => {
    await page.goto('/ruta-inexistente')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Página no encontrada' }),
    ).toBeVisible()
  })

  test('navigates through the main navigation on desktop', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip((viewport?.width ?? 0) < 1024, 'Main navigation is collapsed on small viewports')

    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Navegación principal' })
    await nav.getByRole('link', { name: 'Campeonatos' }).click()
    await expect(page).toHaveURL('/campeonatos')
    await expect(page.getByRole('link', { name: 'Campeonatos' }).first()).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
