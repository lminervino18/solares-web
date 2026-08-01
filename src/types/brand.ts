export type PictureSource = {
  src: string
  webp: string
  width: number
  height: number
  alt: string
}

/** Part of the photo that a cropped frame must keep. */
export type FocalPoint = 'top' | 'center'

export type Crest = {
  id: string
  stageLabel: string
  image: PictureSource
  isCurrent: boolean
}

export type Kit = {
  id: string
  label: string
  image: PictureSource
}
