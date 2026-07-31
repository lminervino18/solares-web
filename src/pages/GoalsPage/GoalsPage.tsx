import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { GoalsSection } from '@/features/goals/components/GoalsSection/GoalsSection'

export function GoalsPage() {
  return (
    <>
      <Seo
        title="Goles de Solares"
        description="Mirá los goles de Solares en fútbol 8 y fútbol 5, filtrados por torneo y goleador."
        canonicalPath={routes.goals}
      />

      <PageLayout>
        <Container>
          <header className="max-w-2xl">
            <Heading as="h1" size="display-md">
              Goles
            </Heading>
            <Text size="lg" tone="secondary" className="mt-3">
              Cada gol quedó grabado. Filtralos por torneo o por goleador.
            </Text>
          </header>

          <div className="mt-10">
            <GoalsSection />
          </div>
        </Container>
      </PageLayout>
    </>
  )
}
