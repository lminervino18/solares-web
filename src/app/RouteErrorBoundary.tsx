import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { ErrorState } from '@/components/feedback/ErrorState/ErrorState'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const description = isRouteErrorResponse(error)
    ? `Error ${String(error.status)}: ${error.statusText}`
    : 'Ocurrió un error inesperado. Intentá nuevamente.'

  return (
    <>
      <Seo title="Error" noindex />
      <PageLayout>
        <Container>
          <ErrorState
            description={description}
            onRetry={() => {
              void navigate(0)
            }}
          />
        </Container>
      </PageLayout>
    </>
  )
}
