import { type ComponentPropsWithoutRef, type ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

export const surfaceVariants = cva('', {
  variants: {
    tone: {
      canvas: 'bg-canvas',
      surface: 'bg-surface',
      elevated: 'bg-surface-elevated',
      transparent: 'bg-transparent',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-(--radius-sm)',
      md: 'rounded-(--radius-md)',
      lg: 'rounded-(--radius-lg)',
      xl: 'rounded-(--radius-xl)',
    },
    border: {
      true: 'border border-line',
      false: '',
    },
    elevation: {
      none: '',
      sm: 'shadow-[var(--shadow-sm)]',
      md: 'shadow-[var(--shadow-md)]',
      lg: 'shadow-[var(--shadow-lg)]',
    },
  },
  defaultVariants: {
    tone: 'surface',
    padding: 'md',
    radius: 'lg',
    border: true,
    elevation: 'none',
  },
})

export type SurfaceProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof surfaceVariants> & {
    as?: ElementType
  }

export function Surface({
  as: Tag = 'div',
  tone,
  padding,
  radius,
  border,
  elevation,
  className,
  ...props
}: SurfaceProps) {
  return (
    <Tag
      className={cn(surfaceVariants({ tone, padding, radius, border, elevation }), className)}
      {...props}
    />
  )
}
