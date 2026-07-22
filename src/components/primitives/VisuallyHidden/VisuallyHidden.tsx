import { type ComponentPropsWithoutRef, type ElementType } from 'react'

import { cn } from '@/lib/cn'

export type VisuallyHiddenProps = ComponentPropsWithoutRef<'span'> & {
  as?: ElementType
}

export function VisuallyHidden({ as: Tag = 'span', className, ...props }: VisuallyHiddenProps) {
  return <Tag className={cn('sr-only', className)} {...props} />
}
