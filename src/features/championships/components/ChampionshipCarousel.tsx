import { useCallback, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/cn'
import { IconButton } from '@/components/primitives/IconButton/IconButton'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import type { Championship, FootballFormat } from '../types/championships'
import { FOOTBALL_FORMAT_LABEL, FOOTBALL_FORMAT_LONG_LABEL } from '../utils/championshipLabels'
import { ChampionshipHonor } from './ChampionshipHonor'
import { TournamentLogo } from './TournamentLogo'

export type ChampionshipCarouselProps = {
  format: FootballFormat
  championships: readonly Championship[]
  selectedChampionshipId: string
  onSelectionChange: (championshipId: string) => void
}

/**
 * Format-scoped tournament carousel. Centers the selected championship, shows
 * adjacent slides on wider viewports and keeps the selection in sync with the
 * URL-driven `selectedChampionshipId`. Programmatic scrolls jump when reduced
 * motion is preferred.
 */
export function ChampionshipCarousel({
  format,
  championships,
  selectedChampionshipId,
  onSelectionChange,
}: ChampionshipCarouselProps) {
  const prefersReducedMotion = useReducedMotionPreference()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    containScroll: 'trimSnaps',
    duration: prefersReducedMotion ? 0 : 22,
  })

  const selectedIndex = Math.max(
    0,
    championships.findIndex((c) => c.id === selectedChampionshipId),
  )

  // Selection is authoritative and prop-driven: clicking a card or a control
  // selects a championship directly, independent of whether Embla can center
  // that slide (with few wide slides some snaps are unreachable). Embla is used
  // only for the visual scroll. `pendingRef` dedupes the direct call and the
  // Embla 'select' event that a programmatic scroll triggers, so a single
  // selection produces a single history entry.
  const pendingRef = useRef<string | null>(null)

  useEffect(() => {
    pendingRef.current = null
  }, [selectedChampionshipId])

  const applySelection = useCallback(
    (championship: Championship | undefined) => {
      if (!championship) return
      if (championship.id === selectedChampionshipId || pendingRef.current === championship.id) {
        return
      }
      pendingRef.current = championship.id
      onSelectionChange(championship.id)
    },
    [selectedChampionshipId, onSelectionChange],
  )

  const select = useCallback(
    (index: number) => {
      const championship = championships[index]
      if (!championship) return
      emblaApi?.scrollTo(index, prefersReducedMotion)
      applySelection(championship)
    },
    [championships, emblaApi, prefersReducedMotion, applySelection],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    applySelection(championships[emblaApi.selectedScrollSnap()])
  }, [emblaApi, championships, applySelection])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi) return
    if (emblaApi.selectedScrollSnap() !== selectedIndex) {
      emblaApi.scrollTo(selectedIndex, prefersReducedMotion)
    }
  }, [emblaApi, selectedIndex, prefersReducedMotion])

  const current = selectedIndex
  const canPrev = current > 0
  const canNext = current < championships.length - 1
  const selected = championships[current]

  // Arrow keys change championship anywhere on the page (no card focus needed),
  // except while typing in a field or while a tab is focused (the tabs use arrow
  // keys to switch F8/F5). Only the active format's carousel is mounted.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return
      }
      if (target?.closest('[role="tab"]')) return
      if (event.key === 'ArrowLeft' && canPrev) {
        event.preventDefault()
        select(current - 1)
      } else if (event.key === 'ArrowRight' && canNext) {
        event.preventDefault()
        select(current + 1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canPrev, canNext, current, select])

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={`Campeonatos de ${FOOTBALL_FORMAT_LONG_LABEL[format]}`}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {championships.map((championship, index) => {
            const isActive = index === current
            return (
              <div
                key={championship.id}
                className="min-w-0 flex-[0_0_86%] pl-3 first:pl-0 sm:flex-[0_0_62%] lg:flex-[0_0_46%]"
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} de ${championships.length}: ${championship.name}`}
              >
                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex h-full w-full items-center gap-3 rounded-(--radius-xl) border p-4 text-left transition-all',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
                    isActive
                      ? 'border-line-strong bg-surface-elevated shadow-[var(--shadow-md)]'
                      : 'border-line bg-surface opacity-70 hover:opacity-100',
                  )}
                >
                  <TournamentLogo championship={championship} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[length:var(--font-size-xs)] font-semibold tracking-wide text-brand uppercase">
                      {FOOTBALL_FORMAT_LABEL[championship.format]}
                    </span>
                    <span className="block truncate text-[length:var(--font-size-md)] font-bold text-primary">
                      {championship.name}
                    </span>
                    <ChampionshipHonor
                      honorType={championship.honorType}
                      trophyTier={championship.trophyTier}
                      resultLabel={championship.resultLabel}
                      className="mt-1"
                    />
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <IconButton
          type="button"
          aria-label="Campeonato anterior"
          size="sm"
          tone="neutral"
          variant="outline"
          disabled={!canPrev}
          onClick={() => select(current - 1)}
          icon={<ChevronLeft className="size-4" aria-hidden="true" />}
        />
        <p className="text-[length:var(--font-size-sm)] text-secondary tabular-nums">
          {current + 1} de {championships.length}
        </p>
        <IconButton
          type="button"
          aria-label="Campeonato siguiente"
          size="sm"
          tone="neutral"
          variant="outline"
          disabled={!canNext}
          onClick={() => select(current + 1)}
          icon={<ChevronRight className="size-4" aria-hidden="true" />}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {selected
          ? `Campeonato de ${FOOTBALL_FORMAT_LABEL[format]} seleccionado: ${selected.name}`
          : ''}
      </p>
    </section>
  )
}
