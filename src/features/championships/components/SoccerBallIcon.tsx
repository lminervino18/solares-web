import type { SVGProps } from 'react'

/**
 * Minimal soccer-ball glyph. Lucide v1 has no ball icon, so this follows the
 * repository convention of a small custom accessible SVG. Decorative by default
 * (`aria-hidden`); pass a `title`/role for a meaningful instance.
 */
export function SoccerBallIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2 8.4 9.9l1.4 4.2h4.4l1.4-4.2z" fill="currentColor" stroke="none" />
      <path d="M12 3v4.2M4.2 9.6l3.8 2.7M6.5 19l1.9-4M17.5 19l-1.9-4M19.8 9.6l-3.8 2.7" />
    </svg>
  )
}
