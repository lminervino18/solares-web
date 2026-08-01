import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { Section } from '@/components/layout/Section/Section'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { HomeIntro } from '@/features/home/HomeIntro'
import { CrestTimeline } from '@/components/brand/CrestTimeline/CrestTimeline'
import { KitGallery } from '@/components/brand/KitGallery/KitGallery'

export function HomePage() {
  return (
    <>
      <Seo description="Sitio oficial de Solares, el Torito Violeta." canonicalPath={routes.home} />

      <HomeIntro />

      <Section spacing="lg" surface="surface" as="section" aria-labelledby="crests-heading">
        <Container size="wide">
          <header className="max-w-2xl">
            <Heading as="h2" id="crests-heading" size="display-sm">
              Escudos
            </Heading>
          </header>
          <div className="mt-10 lg:mt-14">
            <CrestTimeline />
          </div>
        </Container>
      </Section>

      <Section spacing="lg" as="section" aria-labelledby="kits-heading">
        <Container size="wide">
          <header className="max-w-2xl">
            <Heading as="h2" id="kits-heading" size="display-sm">
              Camisetas
            </Heading>
          </header>
          <div className="mt-10 lg:mt-14">
            <KitGallery />
          </div>
        </Container>
      </Section>
    </>
  )
}
