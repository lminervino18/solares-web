import { Link } from 'react-router-dom'

import { siteConfig } from '@/config/site.config'
import { navigationItems } from '@/config/navigation.config'
import { Container } from '@/components/layout/Container/Container'
import { Text } from '@/components/primitives/Text/Text'

const socialLabels: Record<keyof typeof siteConfig.social, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X',
}

export function AppFooter() {
  const currentYear = new Date().getFullYear()
  const socialLinks = Object.entries(siteConfig.social).filter(([, url]) => url !== '')

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container
        size="wide"
        className="flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between"
      >
        <div className="max-w-xs">
          <p className="font-display text-lg font-bold text-primary uppercase">
            {siteConfig.teamName}
          </p>
          <Text size="sm" tone="muted" className="mt-2">
            {siteConfig.description}
          </Text>
        </div>

        <nav
          aria-label="Navegación secundaria"
          className="flex flex-col gap-2 text-sm md:items-end"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="inline-flex min-h-6 items-center rounded-(--radius-sm) text-secondary transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none pointer-coarse:min-h-11"
            >
              {item.label}
            </Link>
          ))}

          {socialLinks.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-2 md:items-end">
              {socialLinks.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-6 items-center rounded-(--radius-sm) text-secondary transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:outline-none pointer-coarse:min-h-11"
                  >
                    {socialLabels[key as keyof typeof siteConfig.social]}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>
      </Container>

      <div className="border-t border-line">
        <Container size="wide" className="py-6">
          <Text size="xs" tone="muted">
            © {currentYear} {siteConfig.teamName}. Todos los derechos reservados.
          </Text>
        </Container>
      </div>
    </footer>
  )
}
