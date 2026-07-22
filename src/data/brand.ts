import type { PictureSource } from '@/types/brand'

import flagJpg from '@/assets/solares/brand/flag.jpg'
import flagWebp from '@/assets/solares/brand/flag.webp'
import currentCrestPng from '@/assets/solares/brand/current-crest.png'
import currentCrestWebp from '@/assets/solares/brand/current-crest.webp'

export const flag: PictureSource = {
  src: flagJpg,
  webp: flagWebp,
  width: 1280,
  height: 512,
  alt: 'Bandera de Solares con el lema Toro en mi rodeo y torazo en rodeo ajeno y el escudo del equipo.',
}

export const currentCrestImage: PictureSource = {
  src: currentCrestPng,
  webp: currentCrestWebp,
  width: 414,
  height: 485,
  alt: 'Escudo actual de Solares: un escudo violeta con una cabeza de toro, dos estrellas y laureles dorados.',
}
