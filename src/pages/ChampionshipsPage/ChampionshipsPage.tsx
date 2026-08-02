import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { ChampionshipsSection } from '@/features/championships/components/ChampionshipsSection'

export function ChampionshipsPage() {
  return (
    <>
      <Seo
        title="Campeonatos"
        description="Recorré los campeonatos de fútbol 8 y fútbol 5 disputados por Solares, sus resultados, goleadores, estadísticas y finales."
        canonicalPath={routes.championships}
      />

      <PageLayout>
        <Container size="wide">
          <header className="max-w-2xl">
            <Heading as="h1" size="display-md">
              Campeonatos
            </Heading>
            <Text size="lg" tone="secondary" className="mt-3">
              Cada torneo que jugamos, partido por partido.
            </Text>
          </header>

          <div className="mt-10">
            <ChampionshipsSection />
          </div>
        </Container>
      </PageLayout>
    </>
  )
}
