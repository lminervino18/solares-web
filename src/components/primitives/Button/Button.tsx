import { type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'

export const buttonVariants = cva(
  [
    'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'transition-colors duration-150 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-canvas)',
    'disabled:pointer-events-none disabled:opacity-60',
    '[--btn-soft:color-mix(in_oklab,var(--btn-accent)_18%,transparent)]',
    '[--btn-soft-hover:color-mix(in_oklab,var(--btn-accent)_28%,transparent)]',
    '[--btn-ghost-hover:color-mix(in_oklab,var(--btn-accent)_12%,transparent)]',
  ],
  {
    variants: {
      tone: {
        brand:
          '[--btn-accent:var(--color-brand)] [--btn-accent-hover:var(--color-brand-hover)] [--btn-accent-active:var(--color-brand-active)] [--btn-on-accent:var(--color-on-brand)]',
        neutral:
          '[--btn-accent:var(--color-control)] [--btn-accent-hover:var(--color-control-hover)] [--btn-accent-active:var(--color-control-active)] [--btn-on-accent:var(--color-on-control)]',
        success:
          '[--btn-accent:var(--color-success)] [--btn-accent-hover:var(--color-success-hover)] [--btn-accent-active:var(--color-success-active)] [--btn-on-accent:var(--color-on-accent)]',
        warning:
          '[--btn-accent:var(--color-warning)] [--btn-accent-hover:var(--color-warning-hover)] [--btn-accent-active:var(--color-warning-active)] [--btn-on-accent:var(--color-on-accent)]',
        danger:
          '[--btn-accent:var(--color-danger)] [--btn-accent-hover:var(--color-danger-hover)] [--btn-accent-active:var(--color-danger-active)] [--btn-on-accent:var(--color-on-accent)]',
      },
      variant: {
        solid:
          'bg-(--btn-accent) text-(--btn-on-accent) hover:bg-(--btn-accent-hover) active:bg-(--btn-accent-active)',
        soft: 'bg-(--btn-soft) text-(--btn-accent) hover:bg-(--btn-soft-hover)',
        outline: 'border border-(--btn-accent) text-(--btn-accent) hover:bg-(--btn-soft)',
        ghost: 'text-(--btn-accent) hover:bg-(--btn-ghost-hover)',
        text: 'text-(--btn-accent) underline-offset-4 hover:text-(--btn-accent-hover) hover:underline',
      },
      size: {
        sm: 'h-8 gap-1.5 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
        xl: 'h-14 px-7 text-lg',
      },
      radius: {
        sm: 'rounded-(--radius-sm)',
        md: 'rounded-(--radius-md)',
        lg: 'rounded-(--radius-lg)',
        pill: 'rounded-(--radius-pill)',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [{ variant: 'text', class: 'h-auto gap-1 px-0' }],
    defaultVariants: {
      tone: 'brand',
      variant: 'solid',
      size: 'md',
      radius: 'md',
      fullWidth: false,
    },
  },
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type ButtonProps = Omit<React.ComponentPropsWithRef<'button'>, 'color'> &
  ButtonVariantProps & {
    loading?: boolean
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  }

export function Button({
  className,
  tone,
  variant,
  size,
  radius,
  fullWidth,
  loading = false,
  disabled,
  leadingIcon,
  trailingIcon,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ tone, variant, size, radius, fullWidth }), className)}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  )
}
