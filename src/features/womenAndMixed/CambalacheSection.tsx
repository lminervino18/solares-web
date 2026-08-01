import { womenAndMixedInstagram, womenAndMixedMedia } from '@/data/womenAndMixed'
import { Section } from '@/components/layout/Section/Section'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { InteractiveCrest } from '@/components/brand/InteractiveCrest/InteractiveCrest'
import { TeamFlag } from '@/components/brand/TeamFlag/TeamFlag'
import { TeamInstagram } from '@/components/brand/TeamInstagram/TeamInstagram'
import { EditorialGallery } from '@/components/media/EditorialGallery/EditorialGallery'

const presentationParagraph =
  'Aunque Solares no cuenta con una rama femenina propia y Cambalache es un equipo en sí mismo, con su propia historia, valores e identidad, se puede decir que ambos equipos comparten una identidad construida desde la amistad, el compromiso, el sentido de pertenencia y las ganas de jugar a la pelota. Son dos equipos diferentes, pero unidos por valores y una forma muy parecida de vivir el fútbol y la vida.'

export function CambalacheSection() {
  const { crest, flag, teamPhotos, coachesPhoto, supportingSolaresPhotos } =
    womenAndMixedMedia.cambalache

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
          <Text size="md" tone="secondary" leading="relaxed" className="mt-5 text-pretty">
            {presentationParagraph}
          </Text>
        </div>

        <div className="order-first lg:order-none">
          <InteractiveCrest crest={crest} priority={false} />
        </div>
      </div>

      <TeamInstagram
        className="mt-10"
        href={womenAndMixedInstagram.cambalache}
        label="Seguir a Cambalache en Instagram"
        description="Seguí a Cambalache para ver su día a día y sus próximos partidos."
      />

      <TeamFlag flag={flag} className="mt-12" />

      <EditorialGallery photos={teamPhotos} label="Fotografías de Cambalache" className="mt-10" />

      <div className="mt-16">
        <Heading as="h3" size="display-sm" className="text-center">
          Vínculos
        </Heading>

        <div className="mt-8 flex flex-col items-center gap-6">
          <Text
            size="lg"
            tone="primary"
            leading="relaxed"
            className="max-w-[36rem] text-center text-pretty"
          >
            Los capitanes de Solares son DTs de Cambalache desde 2023.
          </Text>
          <EditorialGallery
            photos={[coachesPhoto]}
            label="Directores técnicos de Cambalache"
            columns={1}
            crop={false}
            className="w-full max-w-[30rem]"
          />
        </div>

        <div className="mt-14 flex flex-col items-center gap-6">
          <Text
            size="lg"
            tone="primary"
            leading="relaxed"
            className="max-w-[36rem] text-center text-pretty"
          >
            Las jugadoras de Cambalache son hinchas fieles del Torito, en las buenas y en las malas.
          </Text>
          <EditorialGallery
            photos={supportingSolaresPhotos}
            label="Cambalache alentando a Solares"
            className="w-full"
          />
        </div>
      </div>
    </Section>
  )
}
