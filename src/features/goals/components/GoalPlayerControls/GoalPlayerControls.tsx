import {
  Download,
  Gauge,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

import { cn } from '@/lib/cn'
import { IconButton } from '@/components/primitives/IconButton/IconButton'
import { Button, buttonVariants } from '@/components/primitives/Button/Button'
import type { GoalVideo } from '../../types/goals'
import { formatGoalTime } from '../../utils/formatGoalDuration'
import { buildGoalDownloadName } from '../../utils/buildGoalShareUrl'
import { GOAL_PLAYBACK_RATES, type GoalPlayerState } from '../../hooks/useGoalPlayer'
import type { GoalZoom } from '../../hooks/useGoalZoom'
import { GoalShareMenu } from '../GoalShareMenu/GoalShareMenu'

export type GoalPlayerControlsProps = {
  goal: GoalVideo
  player: GoalPlayerState
  zoom: GoalZoom
  shareUrl: string
}

const RANGE = cn(
  'h-1.5 w-full cursor-pointer appearance-none rounded-(--radius-pill) bg-(--color-border)',
  'accent-(--color-brand)',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)',
)

const MENU_ITEM = cn(
  'flex cursor-pointer items-center justify-between gap-4 rounded-(--radius-sm) px-3 py-1.5',
  'text-[length:var(--font-size-sm)] text-primary outline-none data-[highlighted]:bg-surface-elevated',
)

/**
 * Player controls. Every essential action is a persistent, labelled control
 * rather than something that only appears on hover.
 */
export function GoalPlayerControls({ goal, player, zoom, shareUrl }: GoalPlayerControlsProps) {
  const duration = player.duration > 0 ? player.duration : (goal.media.duration ?? 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-right text-[length:var(--font-size-xs)] text-secondary tabular-nums">
          {formatGoalTime(player.currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 1}
          step={0.05}
          value={player.currentTime}
          onChange={(event) => player.seekTo(Number(event.target.value))}
          aria-label="Progreso del video"
          className={RANGE}
        />
        <span className="w-10 shrink-0 text-[length:var(--font-size-xs)] text-secondary tabular-nums">
          {formatGoalTime(duration)}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <IconButton
          aria-label={player.playing ? 'Pausar' : 'Reproducir'}
          tooltip={player.playing ? 'Pausar' : 'Reproducir'}
          variant="solid"
          tone="brand"
          onClick={player.togglePlay}
          icon={
            player.playing ? (
              <Pause aria-hidden className="size-5" />
            ) : (
              <Play aria-hidden className="size-5" />
            )
          }
        />

        <IconButton
          aria-label={player.muted ? 'Activar sonido' : 'Silenciar'}
          tooltip={player.muted ? 'Activar sonido' : 'Silenciar'}
          variant="ghost"
          tone="neutral"
          onClick={player.toggleMuted}
          icon={
            player.muted ? (
              <VolumeX aria-hidden className="size-5" />
            ) : (
              <Volume2 aria-hidden className="size-5" />
            )
          }
        />

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={player.muted ? 0 : player.volume}
          onChange={(event) => player.setVolume(Number(event.target.value))}
          aria-label="Volumen"
          className={cn(RANGE, 'hidden w-24 sm:block')}
        />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              type="button"
              variant="ghost"
              tone="neutral"
              size="sm"
              leadingIcon={<Gauge aria-hidden className="size-4" />}
            >
              {player.rate}x
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={6}
              className="z-[var(--z-toast)] min-w-32 rounded-(--radius-md) border border-line bg-surface p-1 shadow-lg"
            >
              {GOAL_PLAYBACK_RATES.map((rate) => (
                <DropdownMenu.Item
                  key={rate}
                  className={cn(MENU_ITEM, rate === player.rate && 'font-bold text-brand')}
                  onSelect={() => player.setRate(rate)}
                >
                  {rate}x{rate === player.rate && <span className="sr-only"> (activa)</span>}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <span className="mx-1 hidden h-6 w-px bg-(--color-border) sm:block" aria-hidden />

        <IconButton
          aria-label="Alejar"
          tooltip="Alejar"
          variant="ghost"
          tone="neutral"
          disabled={!zoom.isZoomed}
          onClick={zoom.zoomOut}
          icon={<ZoomOut aria-hidden className="size-5" />}
        />
        <span className="min-w-10 text-center text-[length:var(--font-size-xs)] text-secondary tabular-nums">
          {zoom.scale.toFixed(1)}x
        </span>
        <IconButton
          aria-label="Acercar"
          tooltip="Acercar para ver un detalle"
          variant="ghost"
          tone="neutral"
          onClick={zoom.zoomIn}
          icon={<ZoomIn aria-hidden className="size-5" />}
        />
        {zoom.isZoomed && (
          <IconButton
            aria-label="Restablecer el zoom"
            tooltip="Restablecer el zoom"
            variant="ghost"
            tone="neutral"
            onClick={zoom.reset}
            icon={<RotateCcw aria-hidden className="size-5" />}
          />
        )}

        {/* Full width on a phone: wrapped onto its own row, `ml-auto` alone left
            these actions pinned to the right edge and visibly off balance. */}
        <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:ml-auto sm:w-auto sm:justify-end">
          {player.canFullscreen && (
            <IconButton
              aria-label={player.fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              tooltip={player.fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              variant="ghost"
              tone="neutral"
              onClick={player.toggleFullscreen}
              icon={
                player.fullscreen ? (
                  <Minimize aria-hidden className="size-5" />
                ) : (
                  <Maximize aria-hidden className="size-5" />
                )
              }
            />
          )}

          <a
            href={goal.cloudinary.downloadUrl}
            download={buildGoalDownloadName(goal)}
            className={cn(buttonVariants({ variant: 'soft', tone: 'neutral', size: 'sm' }))}
          >
            <Download aria-hidden className="size-4" />
            Descargar
          </a>

          <GoalShareMenu goal={goal} shareUrl={shareUrl} />
        </div>
      </div>
    </div>
  )
}
