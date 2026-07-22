import { Users } from 'lucide-react'

import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { EmptyState } from '@/components/feedback/EmptyState/EmptyState'

export function WomenAndMixedPage() {
  return (
    <>
      <Seo
        title="Femenino y Mixto"
        description="Equipos femenino y mixto de Solares."
        canonicalPath={routes.womenAndMixed}
      />

      <PageLayout>
        <Container>
          <header className="max-w-2xl">
            <Heading as="h1" size="display-md">
              Femenino y Mixto
            </Heading>
            <Text size="lg" tone="secondary" className="mt-3">
              Categorías femenina y mixta de Solares.
            </Text>
          </header>

          <EmptyState
            className="mt-16"
            icon={Users}
            title="Sección preparada"
            description="El contenido de las categorías femenina y mixta se incorporará en una próxima etapa."
          />
        </Container>
      </PageLayout>
    </>
  )
}
