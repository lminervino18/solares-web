import { useState } from 'react'
import { ExternalLink, Play } from 'lucide-react'

import { LinkButton } from '@/components/primitives/LinkButton/LinkButton'
import type { YouTubeVideo } from '../types/championships'

export type FinalVideoProps = {
  video: YouTubeVideo
  championshipName: string
}

/**
 * Lazily embeds the final video after an explicit click (no autoplay), using
 * the privacy-friendly nocookie host. Shows the YouTube thumbnail as a poster
 * beforehand, with an external link fallback. The iframe unmounts when the
 * parent re-keys on a championship change.
 */
export function FinalVideo({ video, championshipName }: FinalVideoProps) {
  const [active, setActive] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative aspect-video w-full overflow-hidden rounded-(--radius-xl) border border-line bg-surface">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`${video.embedUrl}?rel=0&autoplay=1`}
            title={`Final de ${championshipName}`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Reproducir la final de ${championshipName}`}
            className="group absolute inset-0 h-full w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus-ring)"
          >
            {!posterFailed && (
              <img
                src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setPosterFailed(true)}
              />
            )}
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[color-mix(in_oklab,var(--color-canvas)_45%,transparent)] transition-colors group-hover:bg-[color-mix(in_oklab,var(--color-canvas)_30%,transparent)]">
              <span className="flex size-14 items-center justify-center rounded-full bg-brand text-on-brand shadow-[var(--shadow-md)] transition-transform group-hover:scale-105">
                <Play className="size-6 translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="text-[length:var(--font-size-sm)] font-semibold text-primary">
                Reproducir la final
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="mt-3">
        <LinkButton
          href={video.url}
          tone="neutral"
          variant="text"
          size="sm"
          trailingIcon={<ExternalLink className="size-4" aria-hidden="true" />}
        >
          Ver la final en YouTube
        </LinkButton>
      </div>
    </div>
  )
}
