import { type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/cn'

export type DividerProps = ComponentPropsWithoutRef<'div'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function Divider({ orientation = 'horizontal', className, ...props }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-line',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  )
}
