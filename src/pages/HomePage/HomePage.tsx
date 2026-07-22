import { ArrowRight } from 'lucide-react'

import { routes } from '@/constants/routes'
import { siteConfig } from '@/config/site.config'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { Badge } from '@/components/primitives/Badge/Badge'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'
import { EmptyState } from '@/components/feedback/EmptyState/EmptyState'

export function HomePage() {
  return (
    <>
      <Seo canonicalPath={routes.home} />

      <PageLayout>
        <Container>
          <header className="max-w-2xl">
            <Badge tone="brand" variant="soft">
              Sitio oficial
            </Badge>
            <Heading as="h1" size="display-lg" className="mt-4">
              {siteConfig.teamName}
            </Heading>
            <Text size="lg" tone="secondary" className="mt-4">
              {siteConfig.description}
            </Text>
            <div className="mt-8">
              <LinkButton
                to={routes.championships}
                size="lg"
                trailingIcon={<ArrowRight aria-hidden="true" className="size-5" />}
              >
                Ver campeonatos
              </LinkButton>
            </div>
          </header>

          <EmptyState
            className="mt-20"
            title="Sección preparada"
            description="El contenido de esta sección se incorporará en una próxima etapa."
          />
        </Container>
      </PageLayout>
    </>
  )
}
