import { routes } from '@/constants/routes'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Página no encontrada" noindex />

      <PageLayout>
        <Container className="flex flex-col items-center py-16 text-center">
          <Text size="xl" tone="brand" weight="bold" className="font-display">
            404
          </Text>
          <Heading as="h1" size="display-sm" className="mt-2">
            Página no encontrada
          </Heading>
          <Text size="md" tone="secondary" className="mt-3 max-w-md">
            La página que buscás no existe o fue movida.
          </Text>
          <LinkButton to={routes.home} variant="soft" tone="neutral" className="mt-8">
            Volver al inicio
          </LinkButton>
        </Container>
      </PageLayout>
    </>
  )
}
