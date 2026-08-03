import { useEffect, useState } from 'react'
import { Check, Link2, Mail, MessageCircle, Share2 } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'

import { cn } from '@/lib/cn'
import { Button } from '@/components/primitives/Button/Button'
import type { GoalVideo } from '../../types/goals'
import { buildGoalShareText } from '../../utils/buildGoalShareUrl'

export type GoalShareMenuProps = {
  goal: GoalVideo
  shareUrl: string
}

const ITEM = cn(
  'flex cursor-pointer items-center gap-2 rounded-(--radius-sm) px-3 py-2',
  'text-[length:var(--font-size-sm)] text-primary outline-none',
  'data-[highlighted]:bg-surface-elevated',
)

const CONFIRMATION_MS = 2000

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard !== undefined) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // Denied or unavailable: the manual fallback below takes over.
  }
  return false
}

export function GoalShareMenu({ goal, shareUrl }: GoalShareMenuProps) {
  const [copied, setCopied] = useState(false)
  const text = buildGoalShareText(goal)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), CONFIRMATION_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const nativeShare = async () => {
    if (typeof navigator.share !== 'function') return false
    try {
      await navigator.share({ title: text, text, url: shareUrl })
      return true
    } catch {
      // A cancelled share is not an error; the menu simply stays available.
      return true
    }
  }

  const onCopy = async () => {
    const ok = await copyToClipboard(shareUrl)
    setCopied(ok)
    if (!ok) window.prompt('Copiá el enlace del gol', shareUrl)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          variant="soft"
          tone="neutral"
          size="sm"
          leadingIcon={
            copied ? (
              <Check aria-hidden className="size-4" />
            ) : (
              <Share2 aria-hidden className="size-4" />
            )
          }
          onClick={(event) => {
            if (typeof navigator.share === 'function') {
              event.preventDefault()
              void nativeShare()
            }
          }}
        >
          {copied ? 'Enlace copiado' : 'Compartir'}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={6}
          align="end"
          className="z-[var(--z-toast)] min-w-52 rounded-(--radius-md) border border-line bg-surface p-1 shadow-lg"
        >
          <DropdownMenu.Item className={ITEM} onSelect={() => void onCopy()}>
            <Link2 aria-hidden className="size-4 text-secondary" />
            Copiar enlace
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild className={ITEM}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <MessageCircle aria-hidden className="size-4 text-secondary" />
              WhatsApp
            </a>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild className={ITEM}>
            <a
              href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`}
            >
              <Mail aria-hidden className="size-4 text-secondary" />
              Correo electrónico
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
