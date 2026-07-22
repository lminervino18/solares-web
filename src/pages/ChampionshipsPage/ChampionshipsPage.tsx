import { Trophy } from 'lucide-react'

import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { EmptyState } from '@/components/feedback/EmptyState/EmptyState'

export function ChampionshipsPage() {
  return (
    <>
      <Seo
        title="Campeonatos"
        description="Campeonatos disputados por Solares."
        canonicalPath={routes.championships}
      />

      <PageLayout>
        <Container>
          <header className="max-w-2xl">
            <Heading as="h1" size="display-md">
              Campeonatos
            </Heading>
            <Text size="lg" tone="secondary" className="mt-3">
              Seguimiento de los campeonatos de Solares.
            </Text>
          </header>

          <EmptyState
            className="mt-16"
            icon={Trophy}
            title="Sección preparada"
            description="Los campeonatos se incorporarán en una próxima etapa."
          />
        </Container>
      </PageLayout>
    </>
  )
}
