import { ChartNoAxesCombined } from 'lucide-react'

import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { EmptyState } from '@/components/feedback/EmptyState/EmptyState'

export function StatisticsPage() {
  return (
    <>
      <Seo
        title="Estadísticas"
        description="Estadísticas del equipo Solares."
        canonicalPath={routes.statistics}
      />

      <PageLayout>
        <Container>
          <header className="max-w-2xl">
            <Heading as="h1" size="display-md">
              Estadísticas
            </Heading>
            <Text size="lg" tone="secondary" className="mt-3">
              Métricas y rendimiento del equipo Solares.
            </Text>
          </header>

          <EmptyState
            className="mt-16"
            icon={ChartNoAxesCombined}
            title="Sección preparada"
            description="Las estadísticas se incorporarán en una próxima etapa."
          />
        </Container>
      </PageLayout>
    </>
  )
}
