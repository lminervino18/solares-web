import { cn } from '@/lib/cn'

export type ThreeFallbackProps = {
  label?: string
  className?: string
}

export function ThreeFallback({ label = 'Contenido visual', className }: ThreeFallbackProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'grid min-h-40 place-items-center rounded-(--radius-lg) border border-line bg-surface-elevated',
        className,
      )}
    >
      <span className="size-16 rounded-full bg-[color-mix(in_oklab,var(--color-brand)_30%,transparent)]" />
    </div>
  )
}
