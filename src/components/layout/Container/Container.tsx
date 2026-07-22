import { type ComponentPropsWithoutRef, type ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

export const containerVariants = cva('mx-auto w-full px-(--page-gutter)', {
  variants: {
    size: {
      narrow: 'max-w-[var(--container-narrow)]',
      content: 'max-w-[var(--container-content)]',
      wide: 'max-w-[var(--container-wide)]',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'content',
  },
})

export type ContainerProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof containerVariants> & {
    as?: ElementType
  }

export function Container({ as: Tag = 'div', size, className, ...props }: ContainerProps) {
  return <Tag className={cn(containerVariants({ size }), className)} {...props} />
}
