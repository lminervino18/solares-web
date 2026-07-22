import { type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type PageLayoutProps = {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return <div className={cn('py-12 md:py-20', className)}>{children}</div>
}
