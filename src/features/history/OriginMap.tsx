import { ExternalLink, MapPin } from 'lucide-react'

import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'

const MAP_EMBED_URL = 'https://maps.google.com/maps?q=-38.938323,-67.968526&z=15&output=embed'
const MAP_EXTERNAL_URL = 'https://maps.app.goo.gl/KeFDXXi2T5eTtrw68'

export function OriginMap() {
  return (
    <section aria-labelledby="origin-map-title" className="mx-auto max-w-[54rem]">
      <Heading as="h2" id="origin-map-title" size="display-sm">
        Donde empezó todo
      </Heading>
      <Text size="lg" tone="secondary" className="mt-4 max-w-[44rem]">
        El barrio de Cipolletti, Río Negro, donde nació Solares en 2014.
      </Text>

      <div className="mt-6 overflow-hidden rounded-(--radius-xl) border border-line">
        <iframe
          title="Mapa del barrio de origen de Solares en Cipolletti, Río Negro"
          src={MAP_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[16/10] w-full border-0"
        />
      </div>

      <div className="mt-5">
        <LinkButton
          href={MAP_EXTERNAL_URL}
          variant="soft"
          tone="neutral"
          leadingIcon={<MapPin aria-hidden="true" className="size-4" />}
          trailingIcon={<ExternalLink aria-hidden="true" className="size-4" />}
        >
          Abrir en Google Maps
        </LinkButton>
      </div>
    </section>
  )
}
