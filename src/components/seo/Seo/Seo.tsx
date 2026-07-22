import { Helmet } from 'react-helmet-async'

import { siteConfig } from '@/config/site.config'

export type SeoProps = {
  title?: string
  description?: string
  canonicalPath?: string
  image?: string
  noindex?: boolean
  ogType?: 'website' | 'article'
}

export function Seo({
  title,
  description = siteConfig.description,
  canonicalPath,
  image = siteConfig.ogImage,
  noindex = false,
  ogType = 'website',
}: SeoProps) {
  const fullTitle = title ? `${title} | ${siteConfig.teamName}` : siteConfig.teamName
  const canonicalUrl =
    siteConfig.siteUrl && canonicalPath
      ? new URL(canonicalPath, siteConfig.siteUrl).toString()
      : null

  return (
    <Helmet>
      <html lang={siteConfig.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      <meta property="og:site_name" content={siteConfig.teamName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={siteConfig.locale} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
    </Helmet>
  )
}
