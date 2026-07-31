import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { CambalacheSection } from '@/features/womenAndMixed/CambalacheSection'
import { CambalaresSection } from '@/features/womenAndMixed/CambalaresSection'

const sectionLinks = [
  { label: 'Femenino', href: '#femenino' },
  { label: 'Mixto', href: '#mixto' },
]

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
            <Text size="xl" tone="secondary" leading="snug" className="mt-4">
              Dos historias unidas a Solares por la amistad, la identidad y una misma forma de vivir
              el fútbol.
            </Text>
          </header>

          <nav aria-label="Secciones de la página" className="mt-8">
            <ul className="flex flex-wrap gap-3">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
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
