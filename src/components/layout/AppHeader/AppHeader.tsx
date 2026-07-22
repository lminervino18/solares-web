import { Link } from 'react-router-dom'

import { routes } from '@/constants/routes'
import { siteConfig } from '@/config/site.config'
import { Container } from '@/components/layout/Container/Container'
import { AppNavigation } from '@/components/layout/AppNavigation/AppNavigation'
import { MobileNavigation } from '@/components/layout/MobileNavigation/MobileNavigation'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-line bg-[color-mix(in_oklab,var(--color-canvas)_82%,transparent)] backdrop-blur-md">
      <Container
        size="wide"
        className="flex h-[var(--header-height)] items-center justify-between gap-4"
      >
        <Link
          to={routes.home}
          aria-label={`${siteConfig.teamName}, ir al inicio`}
          className="rounded-(--radius-sm) font-display text-xl font-bold tracking-tight text-primary uppercase focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none"
        >
          {siteConfig.teamName}
        </Link>

        <AppNavigation className="hidden lg:flex" />
        <MobileNavigation className="lg:hidden" />
      </Container>
    </header>
  )
}
