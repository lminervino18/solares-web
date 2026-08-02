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
  // A social crawler ignores a relative image, so only emit one we can make absolute.
  const imageUrl =
    image && siteConfig.siteUrl ? new URL(image, siteConfig.siteUrl).toString() : null

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
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
    </Helmet>
  )
}
