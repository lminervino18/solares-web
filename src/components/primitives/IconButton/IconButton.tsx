import { type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'
import { buttonVariants, type ButtonProps } from '@/components/primitives/Button/Button'

const iconButtonSize = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-14',
} as const

export type IconButtonProps = Omit<
  ButtonProps,
  'leadingIcon' | 'trailingIcon' | 'fullWidth' | 'children'
> & {
  'aria-label': string
  icon: ReactNode
  tooltip?: string
}

export function IconButton({
  className,
  tone,
  variant,
  size = 'md',
  radius,
  loading = false,
  disabled,
  icon,
  tooltip,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      title={tooltip}
      className={cn(
        buttonVariants({ tone, variant, size, radius }),
        'px-0',
        iconButtonSize[size ?? 'md'],
        className,
      )}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : icon}
    </button>
  )
}
