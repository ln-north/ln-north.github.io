// Customizable tag order for index page grouping
// Tags listed here appear first in this order; others follow alphabetically.
export const TAG_ORDER: string[] = ['日記']

const defaultSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ln-north.net')

const trimmedSiteUrl = defaultSiteUrl.replace(/\/$/, '')

export const SITE_URL = trimmedSiteUrl

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'えるえぬ雑記帳'

export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Ln_north の雑記帳。日記や記事など雑多な記事、見た目やコンテンツの実装はまだ途中です。'

export function buildSiteUrl(pathname = '/'): string {
  if (!pathname || pathname === '/') return SITE_URL
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${SITE_URL}${normalized}`
}
