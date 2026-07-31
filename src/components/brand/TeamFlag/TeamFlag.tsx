import { cn } from '@/lib/cn'
import { Picture } from '@/components/media/Picture/Picture'
import type { PictureSource } from '@/types/brand'

export type TeamFlagProps = {
  flag: PictureSource
  loading?: 'lazy' | 'eager'
  className?: string
}

export function TeamFlag({ flag, loading = 'lazy', className }: TeamFlagProps) {
  return (
    <figure className={cn('overflow-hidden rounded-(--radius-xl) border border-line', className)}>
      <Picture image={flag} loading={loading} imgClassName="w-full" />
    </figure>
  )
}
