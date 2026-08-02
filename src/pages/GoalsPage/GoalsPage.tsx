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
        title="Goles"
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
              Algunos goles quedan solo en la memoria. Estos, por suerte, quedaron grabados.
            </Text>
            <Text size="sm" tone="muted" className="mt-4">
              Esta sección existe gracias a las chicas de Camba y a Beelup.
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
