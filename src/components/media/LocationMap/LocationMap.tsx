import { ExternalLink, MapPin } from 'lucide-react'

import { cn } from '@/lib/cn'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'

export type LocationMapProps = {
  title?: string
  titleAs?: 'h2' | 'h3'
  description?: string
  coordinates: string
  zoom?: number
  iframeTitle: string
  externalUrl: string
  className?: string
}

export function LocationMap({
  title,
  titleAs = 'h2',
  description,
  coordinates,
  zoom = 15,
  iframeTitle,
  externalUrl,
  className,
}: LocationMapProps) {
  const embedUrl = `https://maps.google.com/maps?q=${coordinates}&z=${String(zoom)}&output=embed`
  const hasHeader = Boolean(title ?? description)

  return (
    <div className={className}>
      {title ? (
        <Heading as={titleAs} size="display-sm">
          {title}
        </Heading>
      ) : null}
      {description ? (
        <Text size="lg" tone="secondary" className={cn('max-w-[44rem]', title && 'mt-4')}>
          {description}
        </Text>
      ) : null}

      <div
        className={cn(
          'overflow-hidden rounded-(--radius-xl) border border-line',
          hasHeader && 'mt-6',
        )}
      >
        <iframe
          title={iframeTitle}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[16/10] w-full border-0"
        />
      </div>

      <div className="mt-5">
        <LinkButton
          href={externalUrl}
          variant="soft"
          tone="neutral"
          leadingIcon={<MapPin aria-hidden="true" className="size-4" />}
          trailingIcon={<ExternalLink aria-hidden="true" className="size-4" />}
        >
          Abrir en Google Maps
        </LinkButton>
      </div>
    </div>
  )
}
