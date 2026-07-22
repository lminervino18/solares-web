import { ArrowRight } from 'lucide-react'

import { routes } from '@/constants/routes'
import { flag } from '@/data/brand'
import { currentCrest } from '@/data/crests'
import { Section } from '@/components/layout/Section/Section'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'
import { Picture } from '@/components/media/Picture/Picture'
import { InteractiveCrest } from '@/components/brand/InteractiveCrest/InteractiveCrest'

const introParagraphs = [
  'Nacimos en un barrio de Cipolletti, Río Negro, y hoy continuamos nuestra historia en Capital Federal. Nos dicen el Torito Violeta y cada semana volvemos a encontrarnos para competir y defender nuestros colores jugando al deporte más lindo del mundo.',
  'Jugamos principalmente fútbol 8, aunque nuestra historia también se escribió en canchas de fútbol 5, fútbol 7 y fútbol 11.',
  'Solares es mucho más que un equipo. Es una forma distinta de vivir la vida y el fútbol. Solo vas a entenderlo si sos parte. Si no, se te va a hacer difícil.',
]

export function HomeIntro() {
  return (
    <Section spacing="lg" as="section">
      <Container size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-2xl">
            <Text
              as="p"
              size="sm"
              tone="brand"
              weight="semibold"
              className="tracking-[0.14em] uppercase"
            >
              ¿Quiénes somos?
            </Text>
            <Heading as="h1" size="display-lg" className="mt-3">
              Solares
            </Heading>
            <Text size="xl" tone="primary" weight="medium" leading="snug" className="mt-5">
              Solares, el equipo de fútbol amateur más grande del mundo.
            </Text>
            <div className="mt-5 space-y-4">
              {introParagraphs.map((paragraph) => (
                <Text key={paragraph.slice(0, 24)} size="md" tone="secondary" leading="relaxed">
                  {paragraph}
                </Text>
              ))}
            </div>
            <div className="mt-8">
              <LinkButton
                to={routes.history}
                size="lg"
                trailingIcon={<ArrowRight aria-hidden="true" className="size-5" />}
              >
                Conocé nuestra historia
              </LinkButton>
            </div>
          </div>

          <div className="order-first lg:order-none">
            <InteractiveCrest crest={currentCrest.image} />
          </div>
        </div>

        <figure className="mt-14 overflow-hidden rounded-(--radius-xl) border border-line">
          <Picture image={flag} imgClassName="w-full" />
        </figure>
      </Container>
    </Section>
  )
}
