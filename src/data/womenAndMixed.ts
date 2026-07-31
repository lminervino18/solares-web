import type { WomenAndMixedMedia } from '@/types/womenAndMixed'

import cambalacheCrestPng from '@/assets/solares/cambalache/brand/crest.png'
import cambalacheCrestWebp from '@/assets/solares/cambalache/brand/crest.webp'
import cambalacheFlagJpg from '@/assets/solares/cambalache/brand/flag.jpg'
import cambalacheFlagWebp from '@/assets/solares/cambalache/brand/flag.webp'
import cambalacheTeam1Jpg from '@/assets/solares/cambalache/team/team-1.jpg'
import cambalacheTeam1Webp from '@/assets/solares/cambalache/team/team-1.webp'
import cambalacheTeam2Jpg from '@/assets/solares/cambalache/team/team-2.jpg'
import cambalacheTeam2Webp from '@/assets/solares/cambalache/team/team-2.webp'
import cambalacheTeam3Jpg from '@/assets/solares/cambalache/team/team-3.jpg'
import cambalacheTeam3Webp from '@/assets/solares/cambalache/team/team-3.webp'
import cambalacheTeam4Jpg from '@/assets/solares/cambalache/team/team-4.jpg'
import cambalacheTeam4Webp from '@/assets/solares/cambalache/team/team-4.webp'
import coachesJpg from '@/assets/solares/cambalache/relationship/coaches.jpg'
import coachesWebp from '@/assets/solares/cambalache/relationship/coaches.webp'
import supportingSolares1Jpg from '@/assets/solares/cambalache/relationship/supporting-solares-1.jpg'
import supportingSolares1Webp from '@/assets/solares/cambalache/relationship/supporting-solares-1.webp'
import supportingSolares2Jpg from '@/assets/solares/cambalache/relationship/supporting-solares-2.jpg'
import supportingSolares2Webp from '@/assets/solares/cambalache/relationship/supporting-solares-2.webp'
import cambalaresCrestPng from '@/assets/solares/cambalares/brand/crest.png'
import cambalaresCrestWebp from '@/assets/solares/cambalares/brand/crest.webp'
import cambalaresTeam1Jpg from '@/assets/solares/cambalares/team/team-1.jpg'
import cambalaresTeam1Webp from '@/assets/solares/cambalares/team/team-1.webp'
import cambalaresTeam2Jpg from '@/assets/solares/cambalares/team/team-2.jpg'
import cambalaresTeam2Webp from '@/assets/solares/cambalares/team/team-2.webp'
import cambalaresTeam3Jpg from '@/assets/solares/cambalares/team/team-3.jpg'
import cambalaresTeam3Webp from '@/assets/solares/cambalares/team/team-3.webp'
import cambalaresTeam4Jpg from '@/assets/solares/cambalares/team/team-4.jpg'
import cambalaresTeam4Webp from '@/assets/solares/cambalares/team/team-4.webp'
import cambalaresTeam5Jpg from '@/assets/solares/cambalares/team/team-5.jpg'
import cambalaresTeam5Webp from '@/assets/solares/cambalares/team/team-5.webp'

export const womenAndMixedMedia: WomenAndMixedMedia = {
  cambalache: {
    crest: {
      src: cambalacheCrestPng,
      webp: cambalacheCrestWebp,
      width: 281,
      height: 357,
      alt: 'Escudo de Cambalache: un escudo rosa con el nombre del equipo, montañas y el año 2022.',
    },
    flag: {
      src: cambalacheFlagJpg,
      webp: cambalacheFlagWebp,
      width: 1280,
      height: 426,
      alt: 'Bandera de Cambalache con franjas rosadas y rojas y el escudo del equipo en el centro.',
    },
    teamPhotos: [
      {
        id: 'cambalache-team-1',
        src: cambalacheTeam1Jpg,
        webp: cambalacheTeam1Webp,
        width: 1179,
        height: 736,
        alt: 'Plantel de Cambalache con camiseta roja posando en una cancha sintética iluminada de noche.',
      },
      {
        id: 'cambalache-team-2',
        src: cambalacheTeam2Jpg,
        webp: cambalacheTeam2Webp,
        width: 1179,
        height: 617,
        alt: 'Jugadoras de Cambalache y allegados celebrando con un trofeo en una cancha de fútbol al atardecer.',
      },
      {
        id: 'cambalache-team-3',
        src: cambalacheTeam3Jpg,
        webp: cambalacheTeam3Webp,
        width: 1179,
        height: 739,
        alt: 'Plantel de Cambalache con camiseta negra y rosa posando frente al arco en una cancha sintética.',
      },
      {
        id: 'cambalache-team-4',
        src: cambalacheTeam4Jpg,
        webp: cambalacheTeam4Webp,
        width: 1600,
        height: 1068,
        alt: 'Plantel de Cambalache con camiseta negra posando de noche junto a un guante de oro, frente al arco.',
      },
    ],
    coachesPhoto: {
      id: 'cambalache-coaches',
      src: coachesJpg,
      webp: coachesWebp,
      width: 1179,
      height: 1132,
      alt: 'Los dos directores técnicos de Cambalache, con chombas con el escudo del equipo, al costado de una cancha de fútbol.',
    },
    supportingSolaresPhotos: [
      {
        id: 'cambalache-supporting-solares-1',
        src: supportingSolares1Jpg,
        webp: supportingSolares1Webp,
        width: 1179,
        height: 1250,
        alt: 'Jugadoras de Cambalache acompañando a jugadores de Solares que sostienen un trofeo en una cancha sintética de noche.',
      },
      {
        id: 'cambalache-supporting-solares-2',
        src: supportingSolares2Jpg,
        webp: supportingSolares2Webp,
        width: 960,
        height: 1280,
        alt: 'Jugadoras de Cambalache junto a jugadores de Solares y un trofeo, frente a la bandera del equipo.',
      },
    ],
  },
  cambalares: {
    crest: {
      src: cambalaresCrestPng,
      webp: cambalaresCrestWebp,
      width: 718,
      height: 942,
      alt: 'Escudo de Cambalares: un escudo negro con el nombre del equipo, una cabeza de toro violeta y montañas rosadas.',
    },
    teamPhotos: [
      {
        id: 'cambalares-team-1',
        src: cambalaresTeam1Jpg,
        webp: cambalaresTeam1Webp,
        width: 1600,
        height: 1600,
        alt: 'Plantel mixto de Cambalares con camiseta violeta celebrando con un trofeo en una cancha sintética de noche.',
      },
      {
        id: 'cambalares-team-2',
        src: cambalaresTeam2Jpg,
        webp: cambalaresTeam2Webp,
        width: 1179,
        height: 1370,
        alt: 'Plantel mixto de Cambalares con camiseta violeta posando frente al arco en una cancha sintética de noche.',
      },
      {
        id: 'cambalares-team-3',
        src: cambalaresTeam3Jpg,
        webp: cambalaresTeam3Webp,
        width: 1179,
        height: 724,
        alt: 'Plantel mixto de Cambalares con camiseta roja celebrando con un trofeo y una bandera que dice Somos campeones.',
      },
      {
        id: 'cambalares-team-4',
        src: cambalaresTeam4Jpg,
        webp: cambalaresTeam4Webp,
        width: 1280,
        height: 854,
        alt: 'Plantel mixto de Cambalares sacándose una foto con un celular en una cancha de césped natural durante el día.',
      },
      {
        id: 'cambalares-team-5',
        src: cambalaresTeam5Jpg,
        webp: cambalaresTeam5Webp,
        width: 1179,
        height: 769,
        alt: 'Plantel mixto de Cambalares celebrando de noche con un trofeo, entre humo y espuma, en una cancha sintética.',
      },
    ],
  },
}
