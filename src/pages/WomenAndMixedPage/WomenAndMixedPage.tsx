import { type MouseEvent } from 'react'

import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { CambalacheSection } from '@/features/womenAndMixed/CambalacheSection'
import { CambalaresSection } from '@/features/womenAndMixed/CambalaresSection'

const sectionLinks = [
  { label: 'Femenino', href: '#femenino' },
  { label: 'Mixto', href: '#mixto' },
]

/**
 * The scroll restoration of the router cancels the browser jump to the fragment, so the
 * section is scrolled and focused explicitly while the address bar keeps the anchor.
 */
function goToSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const section = document.getElementById(href.slice(1))
  if (!section) {
    return
  }
  event.preventDefault()
  window.history.replaceState(null, '', href)
  section.scrollIntoView()
  section.focus({ preventScroll: true })
}

export function WomenAndMixedPage() {
  return (
    <>
      <Seo
        title="Femenino y Mixto de Solares"
        description="Conocé la relación de Solares con Cambalache y la historia de Cambalares, la fusión de ambos equipos en el fútbol mixto."
        canonicalPath={routes.womenAndMixed}
      />

      <PageLayout>
        <Container size="wide">
          <header className="max-w-2xl">
            <Heading as="h1" size="display-lg">
              Femenino y Mixto
            </Heading>
          </header>

          <nav aria-label="Secciones de la página" className="mt-8">
            <ul className="flex flex-wrap gap-3">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      goToSection(event, link.href)
                    }}
                    className="inline-flex rounded-(--radius-sm) border border-line px-4 py-2 text-[length:var(--font-size-sm)] font-semibold text-secondary transition-colors hover:border-line-strong hover:text-primary focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas) focus-visible:outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <CambalacheSection />
          <CambalaresSection />
        </Container>
      </PageLayout>
    </>
  )
}
