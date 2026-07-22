import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'
import { buttonVariants, type ButtonProps } from '@/components/primitives/Button/Button'

type SharedProps = Pick<ButtonProps, 'tone' | 'variant' | 'size' | 'radius' | 'fullWidth'> & {
  className?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  children: ReactNode
}

export type LinkButtonProps = SharedProps &
  ({ to: string; href?: never } | { href: string; to?: never })

export function LinkButton({
  className,
  tone,
  variant,
  size,
  radius,
  fullWidth,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: LinkButtonProps) {
  const classes = cn(buttonVariants({ tone, variant, size, radius, fullWidth }), className)
  const content = (
    <>
      {leadingIcon}
      {children}
      {trailingIcon}
    </>
  )

  if ('href' in props && props.href !== undefined) {
    const isExternal = /^https?:\/\//.test(props.href)
    return (
      <a
        className={classes}
        href={props.href}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <Link className={classes} to={props.to}>
      {content}
    </Link>
  )
}
