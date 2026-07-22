import { AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { Button } from '@/components/primitives/Button/Button'

export type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar esta sección. Intentá nuevamente.',
  onRetry,
  retryLabel = 'Reintentar',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('mx-auto flex max-w-md flex-col items-center py-16 text-center', className)}
    >
      <span className="mb-5 inline-flex size-14 items-center justify-center rounded-(--radius-lg) border border-line bg-surface-elevated text-danger">
        <AlertTriangle aria-hidden="true" className="size-6" />
      </span>
      <Heading as="h2" size="xl" tone="primary">
        {title}
      </Heading>
      <Text size="md" tone="secondary" className="mt-2">
        {description}
      </Text>
      {onRetry ? (
        <Button variant="soft" tone="neutral" className="mt-6" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
