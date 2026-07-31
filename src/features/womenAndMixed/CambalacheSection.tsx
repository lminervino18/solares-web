import { womenAndMixedMedia } from '@/data/womenAndMixed'
import { Section } from '@/components/layout/Section/Section'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { InteractiveCrest } from '@/components/brand/InteractiveCrest/InteractiveCrest'
import { TeamFlag } from '@/components/brand/TeamFlag/TeamFlag'
import { EditorialGallery } from '@/components/media/EditorialGallery/EditorialGallery'

const presentationParagraphs = [
  'Aunque Solares no cuenta con una rama femenina propia, mantiene una conexión muy fuerte con Cambalache, el equipo de fútbol femenino amateur más grande del mundo.',
  'Cambalache comparte con Solares una identidad construida desde la amistad, el compromiso, el sentido de pertenencia y las ganas de encontrarse alrededor de una cancha. Son dos equipos diferentes, pero unidos por valores y una forma muy parecida de vivir el fútbol.',
]

const relationshipParagraphs = [
  'Los capitanes de Solares también acompañan y dirigen a Cambalache. A su vez, las jugadoras de Cambalache están presentes alentando a Solares en las buenas y en las malas.',
  'Son dos equipos diferentes, pero unidos por una relación que se construye dentro y fuera de la cancha.',
]

export function CambalacheSection() {
  const { crest, flag, teamPhotos, coachesPhoto, supportingSolaresPhotos } =
    womenAndMixedMedia.cambalache
  const [firstRelationshipParagraph, ...remainingRelationshipParagraphs] = relationshipParagraphs

  return (
    <Section
      id="femenino"
      spacing="lg"
      aria-labelledby="femenino-title"
      tabIndex={-1}
      className="scroll-mt-24 focus:outline-none"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-2xl">
          <Text
            as="p"
            size="sm"
            tone="brand"
            weight="semibold"
            className="tracking-[0.14em] uppercase"
          >
            Femenino
          </Text>
          <Heading as="h2" id="femenino-title" size="display-md" className="mt-3">
            Cambalache
          </Heading>
          <Text size="xl" tone="primary" weight="medium" leading="snug" className="mt-5">
            El equipo de fútbol femenino amateur más grande del mundo.
          </Text>
          <div className="mt-5 space-y-4">
            {presentationParagraphs.map((paragraph) => (
              <Text key={paragraph.slice(0, 24)} size="md" tone="secondary" leading="relaxed">
                {paragraph}
              </Text>
            ))}
          </div>
        </div>

        <div className="order-first lg:order-none">
          <InteractiveCrest crest={crest} priority={false} />
        </div>
      </div>

      <TeamFlag flag={flag} className="mt-12" />

      <EditorialGallery photos={teamPhotos} label="Fotografías de Cambalache" className="mt-10" />

      <div className="mt-16">
        <Heading as="h3" size="display-sm">
          Una relación que va más allá de la cancha
        </Heading>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Text size="lg" tone="secondary" leading="relaxed" className="text-pretty">
            {firstRelationshipParagraph}
          </Text>
          <EditorialGallery
            photos={[coachesPhoto]}
            label="Directores técnicos de Cambalache"
            columns={1}
            crop={false}
          />
        </div>

        {remainingRelationshipParagraphs.map((paragraph) => (
          <Text
            key={paragraph.slice(0, 24)}
            size="lg"
            tone="secondary"
            leading="relaxed"
            className="mt-6 max-w-[44rem] text-pretty"
          >
            {paragraph}
          </Text>
        ))}

        <div className="mt-14">
          <Heading as="h4" size="xl">
            Siempre presentes
          </Heading>
          <Text size="md" tone="secondary" leading="relaxed" className="mt-3 max-w-[44rem]">
            Cambalache acompaña a Solares en cada etapa, compartiendo los buenos momentos y
            sosteniendo al equipo cuando más lo necesita.
          </Text>
          <EditorialGallery
            photos={supportingSolaresPhotos}
            label="Cambalache alentando a Solares"
            className="mt-6"
          />
        </div>
      </div>
    </Section>
  )
}
