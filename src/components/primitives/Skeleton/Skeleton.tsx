import { type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

export type SkeletonProps = ComponentPropsWithoutRef<'div'>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse rounded-(--radius-md) bg-[color-mix(in_oklab,var(--color-text-secondary)_16%,transparent)]',
        className,
      )}
      {...props}
    />
  )
}
