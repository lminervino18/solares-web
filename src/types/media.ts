export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type VideoAsset = {
  src: string
  poster: string | null
  title: string
}

export type MediaAsset = ImageAsset | VideoAsset
