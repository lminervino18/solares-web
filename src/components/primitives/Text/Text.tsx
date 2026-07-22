import { type ComponentPropsWithoutRef, type ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

export const textVariants = cva('font-body', {
  variants: {
    size: {
      xs: 'text-[length:var(--font-size-xs)]',
      sm: 'text-[length:var(--font-size-sm)]',
      md: 'text-[length:var(--font-size-md)]',
      lg: 'text-[length:var(--font-size-lg)]',
      xl: 'text-[length:var(--font-size-xl)]',
    },
    tone: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted',
      brand: 'text-brand',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    leading: {
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'secondary',
    weight: 'regular',
    leading: 'normal',
  },
})

export type TextProps = ComponentPropsWithoutRef<'p'> &
  VariantProps<typeof textVariants> & {
    as?: ElementType
  }

export function Text({
  as: Tag = 'p',
  size,
  tone,
  weight,
  leading,
  className,
  ...props
}: TextProps) {
  return <Tag className={cn(textVariants({ size, tone, weight, leading }), className)} {...props} />
}
