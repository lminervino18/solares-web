# Media

Media components for the Solares site.

## Implemented

- `ResponsiveImage/ResponsiveImage.tsx` — accessible image with aspect ratio, object-fit,
  lazy loading and an error fallback.

## Prepared for later stages

These are intentionally not implemented yet to keep heavy libraries out of the initial
bundle. Implement them with dynamic imports when a page actually renders them.

- `AspectRatioMedia` — ratio wrapper around arbitrary media.
- `VideoPlayer` — wrapper over `react-player`, dynamically imported. Never autoplay audio;
  provide controls, poster, accessible iframe titles and a fallback.
- `MediaCarousel` — wrapper over `embla-carousel-react` with touch, drag, keyboard,
  previous/next controls, indicators, reduced-motion support and optional autoplay disabled
  by default.
- `Lightbox` — wrapper over `yet-another-react-lightbox`, dynamically imported.

## Rules

- Define image dimensions to avoid layout shift.
- Prefer AVIF/WebP; lazy-load below-the-fold media.
- Dynamically import `react-player` and `yet-another-react-lightbox`.
- Never load third-party embeds before they are needed.
