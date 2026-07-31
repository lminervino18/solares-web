import { useCallback, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog } from 'radix-ui'

import { Button } from '@/components/primitives/Button/Button'
import { IconButton } from '@/components/primitives/IconButton/IconButton'
import { Text } from '@/components/primitives/Text/Text'
import type { GoalVideo } from '../../types/goals'
import { GOAL_FORMAT_LONG_LABEL } from '../../types/goals'
import { selectAdjacentGoals } from '../../selectors/selectAdjacentGoals'
import type { GoalPlaybackRate } from '../../hooks/useGoalPlayer'
import { GoalPlayerStage } from './GoalPlayerStage'

export type GoalPlayerProps = {
  goal: GoalVideo
  goals: readonly GoalVideo[]
  shareUrl: string
  onNavigate: (goal: GoalVideo) => void
  onClose: () => void
}

/**
 * Modal goal player.
 *
 * Previous and next always move inside the filtered collection the gallery is
 * showing, and both ends are closed rather than circular so the position stays
 * unambiguous. The playback rate is held here so it survives moving between
 * clips for the length of the session.
 */
export function GoalPlayer({ goal, goals, shareUrl, onNavigate, onClose }: GoalPlayerProps) {
  const [rate, setRate] = useState<GoalPlaybackRate>(1)
  const { index, total, previous, next } = selectAdjacentGoals(goals, goal.id)

  const goPrevious = useCallback(() => {
    if (previous !== undefined) onNavigate(previous)
  }, [previous, onNavigate])

  const goNext = useCallback(() => {
    if (next !== undefined) onNavigate(next)
  }, [next, onNavigate])

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] bg-[color-mix(in_oklab,var(--color-canvas)_88%,transparent)] backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-[var(--z-dialog)] flex flex-col overflow-y-auto p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
          {/* `my-auto` centres the player when it fits and still lets a taller
              layout scroll from its top instead of being clipped. */}
          <div className="mx-auto my-auto flex w-full max-w-5xl flex-col gap-4">
            <header className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Dialog.Title className="font-display text-[length:var(--font-size-xl)] font-bold text-primary">
                  {goal.scorer.name}
                </Dialog.Title>
                <Dialog.Description asChild>
                  <Text size="sm" tone="secondary" className="mt-0.5">
                    {goal.competition.name} · {GOAL_FORMAT_LONG_LABEL[goal.format]} · Gol{' '}
                    {index + 1} de {total}
                  </Text>
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <IconButton
                  aria-label="Cerrar el reproductor"
                  variant="ghost"
                  tone="neutral"
                  icon={<X aria-hidden className="size-5" />}
                />
              </Dialog.Close>
            </header>

            <div className="flex items-center gap-2">
              <IconButton
                aria-label="Gol anterior"
                tooltip="Gol anterior"
                variant="soft"
                tone="neutral"
                disabled={previous === undefined}
                onClick={goPrevious}
                icon={<ChevronLeft aria-hidden className="size-5" />}
                className="hidden shrink-0 sm:inline-flex"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <GoalPlayerStage
                  key={goal.id}
                  goal={goal}
                  shareUrl={shareUrl}
                  rate={rate}
                  onRateChange={setRate}
                  {...(previous === undefined ? {} : { onPrevious: goPrevious })}
                  {...(next === undefined ? {} : { onNext: goNext })}
                />
              </div>

              <IconButton
                aria-label="Gol siguiente"
                tooltip="Gol siguiente"
                variant="soft"
                tone="neutral"
                disabled={next === undefined}
                onClick={goNext}
                icon={<ChevronRight aria-hidden className="size-5" />}
                className="hidden shrink-0 sm:inline-flex"
              />
            </div>

            <div className="flex items-center justify-between gap-2 sm:hidden">
              <Button
                type="button"
                variant="soft"
                tone="neutral"
                size="sm"
                disabled={previous === undefined}
                leadingIcon={<ChevronLeft aria-hidden className="size-4" />}
                onClick={goPrevious}
              >
                Anterior
              </Button>
              <Button
                type="button"
                variant="soft"
                tone="neutral"
                size="sm"
                disabled={next === undefined}
                trailingIcon={<ChevronRight aria-hidden className="size-4" />}
                onClick={goNext}
              >
                Siguiente
              </Button>
            </div>

            <Text size="xs" tone="muted" className="hidden lg:block">
              Atajos: espacio reproduce, F pantalla completa, M silencio, flechas avanzan, Shift y
              flechas cambian de gol, más y menos hacen zoom, 0 restablece.
            </Text>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
