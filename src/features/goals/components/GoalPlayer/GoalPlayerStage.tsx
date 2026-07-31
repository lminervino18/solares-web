import { useEffect, useRef } from 'react'

import { cn } from '@/lib/cn'
import { Button } from '@/components/primitives/Button/Button'
import { Text } from '@/components/primitives/Text/Text'
import type { GoalVideo } from '../../types/goals'
import { SEEK_STEP_SECONDS, useGoalPlayer, type GoalPlaybackRate } from '../../hooks/useGoalPlayer'
import { useGoalZoom } from '../../hooks/useGoalZoom'
import { GoalPlayerControls } from '../GoalPlayerControls/GoalPlayerControls'

export type GoalPlayerStageProps = {
  goal: GoalVideo
  shareUrl: string
  rate: GoalPlaybackRate
  onRateChange: (rate: GoalPlaybackRate) => void
  onPrevious?: () => void
  onNext?: () => void
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
      <div
        ref={containerRef}
        className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-(--radius-lg) bg-black"
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
              'flex max-h-[68vh] w-full items-center justify-center',
              zoom.isZoomed && (zoom.isPanning ? 'cursor-grabbing' : 'cursor-grab'),
            )}
            style={{ touchAction: zoom.isZoomed ? 'none' : 'auto' }}
          >
            {/* These are short silent action clips with no spoken content, so a
                captions track would carry nothing. The scorer, competition and
                position are exposed as text in the dialog header instead. */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              src={goal.cloudinary.playbackUrl}
              poster={goal.cloudinary.posterUrl}
              playsInline
              preload="auto"
              className="max-h-[68vh] w-auto max-w-full origin-center"
              style={{
                transform: `scale(${zoom.scale}) translate(${zoom.offsetX}%, ${zoom.offsetY}%)`,
                transition: zoom.isPanning ? 'none' : 'transform 150ms ease-out',
              }}
            />
          </div>
        )}
      </div>

      <GoalPlayerControls goal={goal} player={player} zoom={zoom} shareUrl={shareUrl} />
    </>
  )
}
