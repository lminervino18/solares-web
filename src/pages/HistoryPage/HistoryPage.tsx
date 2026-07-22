import { Fragment } from 'react'

import { routes } from '@/constants/routes'
import { historyChapters } from '@/data/history'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { LocationMap } from '@/components/media/LocationMap/LocationMap'
import { HistoryChapter } from '@/features/history/HistoryChapter'
import { HistoryTimeline } from '@/features/history/HistoryTimeline'

const PLAZA_MAP_AFTER_CHAPTER = 'los-primeros-partidos'

export function HistoryPage() {
  return (
    <>
      <Seo
        title="Historia de Solares"
        description="La historia de Solares, desde sus comienzos en Cipolletti hasta la formación de Solares Buenos Aires."
        canonicalPath={routes.history}
      />

      <PageLayout>
        <Container size="wide">
          <header className="mx-auto max-w-[54rem]">
            <Text
              as="p"
              size="sm"
              tone="brand"
              weight="semibold"
              className="tracking-[0.14em] uppercase"
            >
              Nuestra historia
            </Text>
            <Heading as="h1" size="display-lg" className="mt-3">
              La historia de Solares
            </Heading>
            <Text size="xl" tone="secondary" leading="snug" className="mt-4 max-w-[44rem]">
              Desde un barrio de Cipolletti hasta la formación de Solares Buenos Aires.
            </Text>
          </header>

          <div className="mt-14 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-14">
            <div className="mb-10 lg:mb-0">
              <HistoryTimeline />
            </div>

            <div className="space-y-16 lg:space-y-28">
              {historyChapters.map((chapter) => (
                <Fragment key={chapter.id}>
                  <HistoryChapter chapter={chapter} />
                  {chapter.id === PLAZA_MAP_AFTER_CHAPTER ? (
                    <LocationMap
                      className="mx-auto max-w-[54rem]"
                      title="La plaza de Los Tordos"
                      description="En esta plaza de Cipolletti, Solares se reunía a entrenar todos los sábados durante sus primeros años."
                      coordinates="-38.9418688,-67.9719193"
                      zoom={16}
                      iframeTitle="Mapa de la plaza de Los Tordos en Cipolletti, Río Negro"
                      externalUrl="https://maps.app.goo.gl/vQKr48LTRRuHgCWj6"
                    />
                  ) : null}
                </Fragment>
              ))}
            </div>
          </div>
        </Container>
      </PageLayout>
    </>
  )
}
