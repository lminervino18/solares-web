import { type ComponentPropsWithoutRef, type ElementType } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

export const sectionVariants = cva('', {
  variants: {
    spacing: {
      none: 'py-0',
      sm: 'py-8',
      md: 'py-12 md:py-16',
      lg: 'py-16 md:py-24',
      xl: 'py-24 md:py-32',
    },
    surface: {
      none: '',
      surface: 'bg-surface',
      elevated: 'bg-surface-elevated',
    },
  },
  defaultVariants: {
    spacing: 'lg',
    surface: 'none',
  },
})

export type SectionProps = ComponentPropsWithoutRef<'section'> &
  VariantProps<typeof sectionVariants> & {
    as?: ElementType
    fullBleed?: boolean
  }

export function Section({
  as: Tag = 'section',
  spacing,
  surface,
  fullBleed = false,
  className,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(sectionVariants({ spacing, surface }), fullBleed && 'w-full', className)}
      {...props}
    />
  )
}
