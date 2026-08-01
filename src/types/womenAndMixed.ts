import type { FocalPoint, PictureSource } from './brand'

export type TeamPhoto = PictureSource & { id: string; focalPoint?: FocalPoint }

export type WomenAndMixedMedia = {
  readonly cambalache: {
    readonly crest: PictureSource
    readonly flag: PictureSource
    readonly teamPhotos: readonly TeamPhoto[]
    readonly coachesPhoto: TeamPhoto
    readonly supportingSolaresPhotos: readonly TeamPhoto[]
  }
  readonly cambalares: {
    readonly crest: PictureSource
    readonly teamPhotos: readonly TeamPhoto[]
  }
}
