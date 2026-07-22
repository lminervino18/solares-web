import { CirclePlay } from 'lucide-react'

import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { EmptyState } from '@/components/feedback/EmptyState/EmptyState'

export function GoalsPage() {
  return (
    <>
      <Seo title="Goles" description="Goles del equipo Solares." canonicalPath={routes.goals} />

      <PageLayout>
        <Container>
          <header className="max-w-2xl">
            <Heading as="h1" size="display-md">
              Goles
            </Heading>
            <Text size="lg" tone="secondary" className="mt-3">
              Los mejores goles de Solares.
            </Text>
          </header>

          <EmptyState
            className="mt-16"
            icon={CirclePlay}
            title="Sección preparada"
            description="Los goles se incorporarán en una próxima etapa."
          />
        </Container>
      </PageLayout>
    </>
  )
}
