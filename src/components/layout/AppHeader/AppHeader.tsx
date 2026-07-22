import { Container } from '@/components/layout/Container/Container'
import { AppNavigation } from '@/components/layout/AppNavigation/AppNavigation'
import { MobileNavigation } from '@/components/layout/MobileNavigation/MobileNavigation'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-line bg-[color-mix(in_oklab,var(--color-canvas)_82%,transparent)] backdrop-blur-md">
      <Container
        size="wide"
        className="flex h-[var(--header-height)] items-center justify-end gap-4"
      >
        <AppNavigation className="hidden lg:flex" />
        <MobileNavigation className="lg:hidden" />
      </Container>
    </header>
  )
}
