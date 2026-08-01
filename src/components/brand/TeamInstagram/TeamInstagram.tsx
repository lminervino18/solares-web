import { cn } from '@/lib/cn'
import { InstagramIcon } from '@/components/brand/icons/InstagramIcon'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'
import { Text } from '@/components/primitives/Text/Text'
import { VisuallyHidden } from '@/components/primitives/VisuallyHidden/VisuallyHidden'

export type TeamInstagramProps = {
  href: string
  /** Accessible name of the icon-only link. */
  label: string
  description: string
  className?: string
}

export function TeamInstagram({ href, label, description, className }: TeamInstagramProps) {
  return (
    <div className={cn('flex flex-col items-start gap-4 sm:flex-row sm:items-center', className)}>
      <LinkButton href={href} size="lg" variant="soft" tone="brand" className="aspect-square px-0">
        <InstagramIcon className="size-6" />
        <VisuallyHidden>{label}</VisuallyHidden>
      </LinkButton>
      <Text as="p" size="md" tone="secondary">
        {description}
      </Text>
    </div>
  )
}
