import { siteConfig } from '@/config/site.config'

export function formatInteger(value: number, locale: string = siteConfig.locale): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDate(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long' },
  locale: string = siteConfig.locale,
): string {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat(locale, options).format(date)
}
