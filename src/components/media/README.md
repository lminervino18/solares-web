# Media

Media components for the Solares site.

## Implemented

- `Picture/Picture.tsx` — `<picture>` with a WebP source, a fallback and intrinsic
  dimensions. Every optimized asset in `src/assets/solares` is rendered through it.
- `EditorialGallery/EditorialGallery.tsx` — ordered photo blocks in one or two columns,
  with an optional crop, an optional lightbox and lazy loading. The only gallery: do not
  add a per-section variant.
- `Lightbox/Lightbox.tsx` — dynamically imported wrapper over
  `yet-another-react-lightbox`.
- `LocationMap/LocationMap.tsx` — Google Maps `output=embed` (no API key) plus an
  external link.

## Video

Video is played by feature components, not by a shared wrapper:

- `features/goals/components/GoalPlayer` — native `<video>` for the Cloudinary clips.
- `features/championships/components/FinalVideo` — click-to-load
  `youtube-nocookie.com` iframe.

## Rules

- Define image dimensions to avoid layout shift.
- Prefer WebP; lazy-load below-the-fold media.
- Dynamically import `yet-another-react-lightbox`.
- Never load third-party embeds before they are needed.
- Never autoplay audio. The goal player is the one documented exception and is
  explained in `CLAUDE.md`.
