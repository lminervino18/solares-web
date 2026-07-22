import { Link } from 'react-router-dom'

import { routes } from '@/constants/routes'
import { logoIcon } from '@/data/brand'
import { Container } from '@/components/layout/Container/Container'
import { Picture } from '@/components/media/Picture/Picture'
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
          className="rounded-full focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none"
        >
          <Picture image={logoIcon} loading="eager" imgClassName="size-10" />
        </Link>

        <AppNavigation className="hidden lg:flex" />
        <MobileNavigation className="lg:hidden" />
      </Container>
    </header>
  )
}
