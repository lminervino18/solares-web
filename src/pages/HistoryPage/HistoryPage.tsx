import { routes } from '@/constants/routes'
import { historyChapters } from '@/data/history'
import { Seo } from '@/components/seo/Seo/Seo'
import { PageLayout } from '@/components/layout/PageLayout/PageLayout'
import { Container } from '@/components/layout/Container/Container'
import { Heading } from '@/components/primitives/Heading/Heading'
import { Text } from '@/components/primitives/Text/Text'
import { HistoryChapter } from '@/features/history/HistoryChapter'
import { HistoryTimeline } from '@/features/history/HistoryTimeline'
import { OriginMap } from '@/features/history/OriginMap'

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
                <HistoryChapter key={chapter.id} chapter={chapter} />
              ))}

              <OriginMap />
            </div>
          </div>
        </Container>
      </PageLayout>
    </>
  )
}
