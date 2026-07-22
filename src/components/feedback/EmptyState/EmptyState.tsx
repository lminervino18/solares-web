import { type ReactNode } from 'react'
import { Inbox, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'

type EmptyStateSize = 'sm' | 'md' | 'lg'

export type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  size?: EmptyStateSize
  className?: string
}

const sizePadding: Record<EmptyStateSize, string> = {
  sm: 'py-10',
  md: 'py-16',
  lg: 'py-24',
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-md flex-col items-center text-center',
        sizePadding[size],
        className,
      )}
    >
      <span className="mb-5 inline-flex size-14 items-center justify-center rounded-(--radius-lg) border border-line bg-surface-elevated text-brand">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <Heading as="h2" size="xl" tone="primary">
        {title}
      </Heading>
      {description ? (
        <Text size="md" tone="secondary" className="mt-2">
          {description}
        </Text>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
