import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Text } from '@/components/primitives/Text/Text'

export type LoadingStateProps = {
  label?: string
  className?: string
}

export function LoadingState({ label = 'Cargando', className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}
    >
      <Loader2 aria-hidden="true" className="size-6 animate-spin text-brand" />
      <Text size="sm" tone="secondary">
        {label}
      </Text>
    </div>
  )
}
