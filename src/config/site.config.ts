type SocialLinks = {
  instagram: string
  youtube: string
  tiktok: string
  x: string
}

type SiteConfig = {
  teamName: string
  shortName: string
  description: string
  locale: string
  language: string
  siteUrl: string
  themeColor: string
  ogImage: string
  logo: {
    primary: string
    monochrome: string
  }
  social: SocialLinks
}

export const siteConfig = {
  teamName: 'Solares',
  shortName: 'Solares',
  description: 'Sitio oficial del equipo de fútbol Solares.',
  locale: 'es-AR',
  language: 'es-AR',
  siteUrl: import.meta.env.VITE_SITE_URL ?? '',
  themeColor: '#25064f',
  ogImage: '',
  logo: {
    primary: '/assets/images/solares-logo.svg',
    monochrome: '/assets/images/solares-logo-monochrome.svg',
  },
  social: {
    instagram: '',
    youtube: '',
    tiktok: '',
    x: '',
  },
} satisfies SiteConfig

export type { SiteConfig, SocialLinks }
