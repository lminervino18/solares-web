import { type ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

export const headingVariants = cva('font-display font-bold text-balance', {
  variants: {
    size: {
      'display-lg': 'text-[length:var(--font-size-display-lg)] leading-[1.05]',
      'display-md': 'text-[length:var(--font-size-display-md)] leading-[1.1]',
      'display-sm': 'text-[length:var(--font-size-display-sm)] leading-[1.15]',
      xl: 'text-[length:var(--font-size-xl)] leading-snug',
      lg: 'text-[length:var(--font-size-lg)] leading-snug',
      md: 'text-[length:var(--font-size-md)] leading-snug',
    },
    tone: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      brand: 'text-brand',
    },
  },
  defaultVariants: {
    size: 'display-md',
    tone: 'primary',
  },
})

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type HeadingProps = ComponentPropsWithoutRef<'h2'> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingElement
  }

export function Heading({ as: Tag = 'h2', size, tone, className, ...props }: HeadingProps) {
  return <Tag className={cn(headingVariants({ size, tone }), className)} {...props} />
}
