import type { Crest } from '@/types/brand'
import { invariant } from '@/lib/invariant'

import crest1Png from '@/assets/solares/crests/crest-1.png'
import crest1Webp from '@/assets/solares/crests/crest-1.webp'
import crest2Png from '@/assets/solares/crests/crest-2.png'
import crest2Webp from '@/assets/solares/crests/crest-2.webp'
import crest3Png from '@/assets/solares/crests/crest-3.png'
import crest3Webp from '@/assets/solares/crests/crest-3.webp'
import crest4Png from '@/assets/solares/crests/crest-4.png'
import crest4Webp from '@/assets/solares/crests/crest-4.webp'
import crest5Png from '@/assets/solares/crests/crest-5.png'
import crest5Webp from '@/assets/solares/crests/crest-5.webp'

export const crests: readonly Crest[] = [
  {
    id: 'crest-1',
    stageLabel: 'Primera etapa',
    isCurrent: false,
    image: {
      src: crest1Png,
      webp: crest1Webp,
      width: 688,
      height: 708,
      alt: 'Escudo de Solares con la letra S en verde y una franja amarilla.',
    },
  },
  {
    id: 'crest-2',
    stageLabel: 'Segunda etapa',
    isCurrent: false,
    image: {
      src: crest2Png,
      webp: crest2Webp,
      width: 458,
      height: 395,
      alt: 'Escudo de Solares con forma de hexágono amarillo y negro con una cabeza de animal.',
    },
  },
  {
    id: 'crest-3',
    stageLabel: 'Tercera etapa',
    isCurrent: false,
    image: {
      src: crest3Png,
      webp: crest3Webp,
      width: 787,
      height: 800,
      alt: 'Escudo circular violeta de Solares de la Falda con una cabeza de toro.',
    },
  },
  {
    id: 'crest-4',
    stageLabel: 'Cuarta etapa',
    isCurrent: false,
    image: {
      src: crest4Png,
      webp: crest4Webp,
      width: 708,
      height: 800,
      alt: 'Escudo circular violeta de Solares de la Falda con una cabeza de toro y dos estrellas.',
    },
  },
  {
    id: 'crest-5',
    stageLabel: 'Escudo actual',
    isCurrent: true,
    image: {
      src: crest5Png,
      webp: crest5Webp,
      width: 395,
      height: 439,
      alt: 'Escudo actual de Solares: un escudo violeta con una cabeza de toro, dos estrellas y laureles dorados.',
    },
  },
]

const foundCurrentCrest = crests.find((crest) => crest.isCurrent)
invariant(foundCurrentCrest, 'A current crest must be configured')

export const currentCrest: Crest = foundCurrentCrest
