import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Button } from '@/components/primitives/Button/Button'
import { Text } from '@/components/primitives/Text/Text'
import type { GoalVideo } from '../../types/goals'
import { SEEK_STEP_SECONDS, useGoalPlayer, type GoalPlaybackRate } from '../../hooks/useGoalPlayer'
import { useGoalZoom } from '../../hooks/useGoalZoom'
import { selectGoalPlaybackUrl } from '../../utils/selectGoalPlaybackUrl'
import { GoalPlayerControls } from '../GoalPlayerControls/GoalPlayerControls'

export type GoalPlayerStageProps = {
  goal: GoalVideo
  shareUrl: string
  rate: GoalPlaybackRate
  onRateChange: (rate: GoalPlaybackRate) => void
  onPrevious?: () => void
  onNext?: () => void
}

/** Tallest the video area may get, leaving room for the header and controls. */
const MAX_STAGE_HEIGHT = '62vh'

/** Below this width the stage is never wide enough to need the full rendition. */
const COMPACT_VIEWPORT = '(max-width: 640px)'
const DEFAULT_ASPECT_RATIO = 16 / 9

function stageAspectRatio(goal: GoalVideo): number {
  if (goal.media.aspectRatio !== undefined && goal.media.aspectRatio > 0) {
    return goal.media.aspectRatio
  }
  const { width, height } = goal.media
  if (width !== undefined && height !== undefined && height > 0) return width / height
  return DEFAULT_ASPECT_RATIO
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

/**
 * The video surface for one goal.
 *
 * Mounted with the goal id as its key, so every clip gets fresh playback and
 * zoom state without reset effects. The clip keeps its original aspect ratio —
 * the 4:3 poster crop is only a device for the grid.
 */
export function GoalPlayerStage({
  goal,
  shareUrl,
  rate,
  onRateChange,
  onPrevious,
  onNext,
}: GoalPlayerStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const player = useGoalPlayer({
    videoRef,
    containerRef,
    initialRate: rate,
    onRateChange,
    autoPlay: true,
    ...(goal.media.duration === undefined ? {} : { fallbackDuration: goal.media.duration }),
  })
  const zoom = useGoalZoom()
  const aspectRatio = stageAspectRatio(goal)
  const compact = useMediaQuery(COMPACT_VIEWPORT)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      if (event.key === ' ' || event.key === 'k') {
        event.preventDefault()
        player.togglePlay()
      } else if (event.key === 'f') {
        event.preventDefault()
        player.toggleFullscreen()
      } else if (event.key === 'm') {
        event.preventDefault()
        player.toggleMuted()
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        zoom.zoomIn()
      } else if (event.key === '-') {
        event.preventDefault()
        zoom.zoomOut()
      } else if (event.key === '0') {
        event.preventDefault()
        zoom.reset()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (event.shiftKey) onPrevious?.()
        else player.seekBy(-SEEK_STEP_SECONDS)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (event.shiftKey) onNext?.()
        else player.seekBy(SEEK_STEP_SECONDS)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [player, zoom, onPrevious, onNext])

  return (
    <>
      {/* The stage takes its exact size from the manifest before the clip
          loads, so the player never resizes once the video appears. The width
          is whichever is smaller: the available width, or the width that makes
          the clip exactly as tall as the allowed maximum. */}
      <div
        ref={containerRef}
        style={{
          aspectRatio: String(aspectRatio),
          width: `min(100%, calc(${MAX_STAGE_HEIGHT} * ${String(aspectRatio)}))`,
        }}
        className="relative mx-auto flex min-w-0 items-center justify-center overflow-hidden rounded-(--radius-lg) bg-black"
      >
        {player.failed ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <Text size="md" tone="primary" weight="semibold">
              No pudimos reproducir este gol.
            </Text>
            <Button
              type="button"
              variant="outline"
              tone="brand"
              size="sm"
              onClick={() => window.open(goal.cloudinary.secureUrl, '_blank', 'noopener')}
            >
              Abrir video
            </Button>
          </div>
        ) : (
          <div
            onPointerDown={zoom.onPointerDown}
            onPointerMove={zoom.onPointerMove}
            onPointerUp={zoom.onPointerUp}
            onPointerCancel={zoom.onPointerUp}
            className={cn(
              'flex h-full w-full items-center justify-center',
              zoom.isZoomed && (zoom.isPanning ? 'cursor-grabbing' : 'cursor-grab'),
            )}
            style={{ touchAction: zoom.isZoomed ? 'none' : 'auto' }}
          >
            {/* No poster: showing the thumbnail and swapping it for the clip
                reads as a flicker. The reserved box holds the size and a
                spinner covers the wait instead. */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              src={selectGoalPlaybackUrl(goal, compact)}
              playsInline
              preload="auto"
              className={cn(
                'h-full w-full origin-center object-contain transition-opacity duration-150',
                player.ready ? 'opacity-100' : 'opacity-0',
              )}
              style={{
                transform: `scale(${zoom.scale}) translate(${zoom.offsetX}%, ${zoom.offsetY}%)`,
                transition: zoom.isPanning ? 'none' : 'transform 150ms ease-out',
              }}
            />
          </div>
        )}

        {!player.ready && !player.failed && (
          <div className="absolute inset-0 flex items-center justify-center" role="status">
            <Loader2
              aria-hidden
              className="size-8 animate-spin text-white/70 motion-reduce:animate-none"
            />
            <span className="sr-only">Cargando el gol</span>
          </div>
        )}
      </div>

      <GoalPlayerControls goal={goal} player={player} zoom={zoom} shareUrl={shareUrl} />
    </>
  )
}
