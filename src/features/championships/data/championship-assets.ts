import apertura2022Jpg from '@/assets/solares/championships/f8/apertura-2022/team-photo.jpg'
import apertura2022Webp from '@/assets/solares/championships/f8/apertura-2022/team-photo.webp'
import clausura2022Jpg from '@/assets/solares/championships/f8/clausura-2022/team-photo.jpg'
import clausura2022Webp from '@/assets/solares/championships/f8/clausura-2022/team-photo.webp'
import apertura2023Jpg from '@/assets/solares/championships/f8/apertura-2023/team-photo.jpg'
import apertura2023Webp from '@/assets/solares/championships/f8/apertura-2023/team-photo.webp'
import clausura2023Jpg from '@/assets/solares/championships/f8/clausura-2023/team-photo.jpg'
import clausura2023Webp from '@/assets/solares/championships/f8/clausura-2023/team-photo.webp'
import apertura2024Jpg from '@/assets/solares/championships/f8/apertura-2024/team-photo.jpg'
import apertura2024Webp from '@/assets/solares/championships/f8/apertura-2024/team-photo.webp'
import clausura2024Jpg from '@/assets/solares/championships/f8/clausura-2024/team-photo.jpg'
import clausura2024Webp from '@/assets/solares/championships/f8/clausura-2024/team-photo.webp'
import apertura2025Jpg from '@/assets/solares/championships/f8/apertura-2025/team-photo.jpg'
import apertura2025Webp from '@/assets/solares/championships/f8/apertura-2025/team-photo.webp'
import clausura2025Jpg from '@/assets/solares/championships/f8/clausura-2025/team-photo.jpg'
import clausura2025Webp from '@/assets/solares/championships/f8/clausura-2025/team-photo.webp'
import clausura2025F5Jpg from '@/assets/solares/championships/f5/clausura-2025/team-photo.jpg'
import clausura2025F5Webp from '@/assets/solares/championships/f5/clausura-2025/team-photo.webp'
import apertura2026F5Jpg from '@/assets/solares/championships/f5/apertura-2026/team-photo.jpg'
import apertura2026F5Webp from '@/assets/solares/championships/f5/apertura-2026/team-photo.webp'
import deprimeraLogo from '@/assets/solares/championships/logos/deprimera.png'
import tdeaLogo from '@/assets/solares/championships/logos/tdea.png'
import torneosIndianaLogo from '@/assets/solares/championships/logos/torneos-indiana.png'

export type ChampionshipTeamPhoto = {
  readonly src: string
  readonly webp: string
  readonly width: number
  readonly height: number
}

export type ChampionshipLeagueLogo = {
  readonly src: string
}

export const championshipTeamPhotos = {
  'f8-apertura-2022': { src: apertura2022Jpg, webp: apertura2022Webp, width: 1179, height: 1094 },
  'f8-clausura-2022': { src: clausura2022Jpg, webp: clausura2022Webp, width: 1179, height: 1143 },
  'f8-apertura-2023': { src: apertura2023Jpg, webp: apertura2023Webp, width: 1179, height: 822 },
  'f8-clausura-2023': { src: clausura2023Jpg, webp: clausura2023Webp, width: 1179, height: 1145 },
  'f8-apertura-2024': { src: apertura2024Jpg, webp: apertura2024Webp, width: 1179, height: 1115 },
  'f8-clausura-2024': { src: clausura2024Jpg, webp: clausura2024Webp, width: 1179, height: 717 },
  'f8-apertura-2025': { src: apertura2025Jpg, webp: apertura2025Webp, width: 1179, height: 728 },
  'f8-clausura-2025': { src: clausura2025Jpg, webp: clausura2025Webp, width: 1179, height: 1096 },
  'f5-clausura-2025': {
    src: clausura2025F5Jpg,
    webp: clausura2025F5Webp,
    width: 1179,
    height: 1218,
  },
  'f5-apertura-2026': {
    src: apertura2026F5Jpg,
    webp: apertura2026F5Webp,
    width: 1179,
    height: 1190,
  },
} satisfies Record<string, ChampionshipTeamPhoto>

export const championshipLeagueLogos = {
  'torneos-indiana': { src: torneosIndianaLogo },
  tdea: { src: tdeaLogo },
  deprimera: { src: deprimeraLogo },
} satisfies Record<string, ChampionshipLeagueLogo>

export function getTeamPhoto(championshipId: string): ChampionshipTeamPhoto | undefined {
  return championshipTeamPhotos[championshipId as keyof typeof championshipTeamPhotos]
}

export function getLeagueLogo(leagueSlug: string): ChampionshipLeagueLogo | undefined {
  return championshipLeagueLogos[leagueSlug as keyof typeof championshipLeagueLogos]
}
