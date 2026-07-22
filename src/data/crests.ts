import type { Crest } from '@/types/brand'
import { invariant } from '@/lib/invariant'

import crest1Jpg from '@/assets/solares/crests/crest-1.jpg'
import crest1Webp from '@/assets/solares/crests/crest-1.webp'
import crest2Jpg from '@/assets/solares/crests/crest-2.jpg'
import crest2Webp from '@/assets/solares/crests/crest-2.webp'
import crest3Jpg from '@/assets/solares/crests/crest-3.jpg'
import crest3Webp from '@/assets/solares/crests/crest-3.webp'
import crest4Jpg from '@/assets/solares/crests/crest-4.jpg'
import crest4Webp from '@/assets/solares/crests/crest-4.webp'
import crest5Jpg from '@/assets/solares/crests/crest-5.jpg'
import crest5Webp from '@/assets/solares/crests/crest-5.webp'

export const crests: readonly Crest[] = [
  {
    id: 'crest-1',
    stageLabel: 'Primera etapa',
    isCurrent: false,
    image: {
      src: crest1Jpg,
      webp: crest1Webp,
      width: 640,
      height: 640,
      alt: 'Escudo de Solares con la letra S en verde y una franja amarilla.',
    },
  },
  {
    id: 'crest-2',
    stageLabel: 'Segunda etapa',
    isCurrent: false,
    image: {
      src: crest2Jpg,
      webp: crest2Webp,
      width: 500,
      height: 500,
      alt: 'Escudo de Solares con forma de hexágono amarillo y negro con una cabeza de animal.',
    },
  },
  {
    id: 'crest-3',
    stageLabel: 'Tercera etapa',
    isCurrent: false,
    image: {
      src: crest3Jpg,
      webp: crest3Webp,
      width: 640,
      height: 640,
      alt: 'Escudo circular violeta de Solares de la Falda con una cabeza de toro.',
    },
  },
  {
    id: 'crest-4',
    stageLabel: 'Cuarta etapa',
    isCurrent: false,
    image: {
      src: crest4Jpg,
      webp: crest4Webp,
      width: 640,
      height: 640,
      alt: 'Escudo circular violeta de Solares de la Falda con dos estrellas y el año 2014.',
    },
  },
  {
    id: 'crest-5',
    stageLabel: 'Escudo actual',
    isCurrent: true,
    image: {
      src: crest5Jpg,
      webp: crest5Webp,
      width: 414,
      height: 485,
      alt: 'Escudo actual de Solares: un escudo violeta con una cabeza de toro, dos estrellas y laureles dorados.',
    },
  },
]

const foundCurrentCrest = crests.find((crest) => crest.isCurrent)
invariant(foundCurrentCrest, 'A current crest must be configured')

export const currentCrest: Crest = foundCurrentCrest
