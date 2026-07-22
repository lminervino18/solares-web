import { test, expect } from '@playwright/test'

test.describe('accessibility', () => {
  test('exposes a keyboard-focusable skip link', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: 'Saltar al contenido' })
    await expect(skipLink).toBeFocused()
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

    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(errors).toEqual([])
  })

  test('opens and closes the mobile menu with the keyboard', async ({ page }) => {
    const viewport = page.viewportSize()
    test.skip((viewport?.width ?? 0) >= 1024, 'The mobile menu is only shown on small viewports')

    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menú de navegación' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Inicio' })).toBeVisible()
    await expect(dialog.getByRole('link', { name: 'Historia' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
