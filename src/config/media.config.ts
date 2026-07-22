export type AspectRatioPreset = '1/1' | '4/3' | '3/2' | '16/9' | '21/9'

type MediaConfig = {
  defaultAspectRatio: AspectRatioPreset
  imageSizes: string
  allowExternalEmbeds: boolean
}

export const mediaConfig = {
  defaultAspectRatio: '16/9',
  imageSizes: '(min-width: 64rem) 60vw, 100vw',
  allowExternalEmbeds: false,
} satisfies MediaConfig
