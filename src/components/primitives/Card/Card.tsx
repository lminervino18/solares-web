import { cn } from '@/lib/cn'
import { Surface, type SurfaceProps } from '@/components/primitives/Surface/Surface'

export type CardProps = SurfaceProps & {
  interactive?: boolean
}

export function Card({ as = 'article', interactive = false, className, ...props }: CardProps) {
  return (
    <Surface
      as={as}
      className={cn(
        interactive &&
          'transition-colors duration-150 ease-out focus-within:border-line-strong hover:border-line-strong',
        className,
      )}
      {...props}
    />
  )
}
