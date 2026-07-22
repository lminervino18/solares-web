import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { StatisticsSection } from '@/features/statistics/components/StatisticsSection'

export function StatisticsPage() {
  return (
    <>
      <Seo
        title="Estadísticas"
        description="Las estadísticas históricas de Solares en fútbol 8 y fútbol 5: torneos, títulos, goleadores, rachas, rivales y récords."
        canonicalPath={routes.statistics}
      />

      <PageLayout>
        <Container size="wide">
          <header className="max-w-2xl">
            <Heading as="h1" size="display-md">
              Estadísticas
            </Heading>
            <Text size="lg" tone="secondary" className="mt-3">
              Los números que cuentan la historia competitiva de Solares.
            </Text>
          </header>

          <div className="mt-10">
            <StatisticsSection />
          </div>
        </Container>
      </PageLayout>
    </>
  )
}
