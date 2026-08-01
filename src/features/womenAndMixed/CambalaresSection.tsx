import { currentCrestImage } from '@/data/brand'
import { womenAndMixedInstagram, womenAndMixedMedia } from '@/data/womenAndMixed'
import { Section } from '@/components/layout/Section/Section'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { CrestFusion } from '@/components/brand/CrestFusion/CrestFusion'
import { TeamInstagram } from '@/components/brand/TeamInstagram/TeamInstagram'
import { EditorialGallery } from '@/components/media/EditorialGallery/EditorialGallery'

const presentationParagraphs = [
  'De manera esporádica, Solares y Cambalache se unen para disputar torneos mixtos. De esa combinación nace Cambalares, la fusión de ambos equipos.',
  'Cambalares es el equipo de fútbol mixto más grande de toda la historia. Generalmente participa en torneos relámpago y en competencias de verano o invierno, reuniendo en una misma camiseta la identidad, los colores y el espíritu de los dos equipos.',
]

export function CambalaresSection() {
  const { crest, teamPhotos } = womenAndMixedMedia.cambalares

  return (
    <Section
      id="mixto"
      spacing="lg"
      aria-labelledby="mixto-title"
      tabIndex={-1}
      className="scroll-mt-24 focus:outline-none"
    >
      <div className="max-w-2xl">
        <Text
          as="p"
          size="sm"
          tone="brand"
          weight="semibold"
          className="tracking-[0.14em] uppercase"
        >
          Mixto
        </Text>
        <Heading as="h2" id="mixto-title" size="display-md" className="mt-3">
          Cambalares
        </Heading>
      </div>

      <CrestFusion
        left={womenAndMixedMedia.cambalache.crest}
        right={currentCrestImage}
        result={crest}
        label="Cambalache más Solares da origen a Cambalares."
        className="mt-10"
      />

      <div className="mt-12 max-w-[44rem] space-y-4">
        {presentationParagraphs.map((paragraph) => (
          <Text
            key={paragraph.slice(0, 24)}
            size="lg"
            tone="secondary"
            leading="relaxed"
            className="text-pretty"
          >
            {paragraph}
          </Text>
        ))}
      </div>

      <TeamInstagram
        className="mt-10"
        href={womenAndMixedInstagram.cambalares}
        label="Seguir a Cambalares en Instagram"
        description="Seguí a Cambalares para enterarte de los próximos torneos mixtos."
      />

      <EditorialGallery photos={teamPhotos} label="Fotografías de Cambalares" className="mt-10" />
    </Section>
  )
}
