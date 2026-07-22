import { type ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-(--radius-pill) font-semibold uppercase tracking-wide',
  {
    variants: {
      tone: {
        brand: '[--badge-accent:var(--color-brand)] [--badge-on:var(--color-on-brand)]',
        neutral: '[--badge-accent:var(--color-text-secondary)] [--badge-on:var(--color-canvas)]',
        success: '[--badge-accent:var(--color-success)] [--badge-on:var(--color-on-accent)]',
        warning: '[--badge-accent:var(--color-warning)] [--badge-on:var(--color-on-accent)]',
        danger: '[--badge-accent:var(--color-danger)] [--badge-on:var(--color-on-accent)]',
      },
      variant: {
        soft: 'bg-[color-mix(in_oklab,var(--badge-accent)_18%,transparent)] text-(--badge-accent)',
        solid: 'bg-(--badge-accent) text-(--badge-on)',
        outline: 'border border-(--badge-accent) text-(--badge-accent)',
      },
      size: {
        sm: 'px-2 py-0.5 text-[0.65rem]',
        md: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: {
      tone: 'brand',
      variant: 'soft',
      size: 'md',
    },
  },
)

export type BadgeProps = ComponentPropsWithoutRef<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ tone, variant, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, variant, size }), className)} {...props} />
}
