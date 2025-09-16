import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next'
import { getAllPostsMeta, getPostBySlug, type PostMeta } from '../lib/posts'
import { formatDateYYYYMD, isoDateJST } from '../lib/formatDate'
import { TAG_ORDER, SITE_DESCRIPTION, SITE_NAME, buildSiteUrl } from '../lib/config'

type Props = {
  posts: PostMeta[]
  diaryContentBySlug: Record<string, string>
}

function isSameMonthJST(iso: string, ref = new Date()): boolean {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return false
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  const refJst = new Date(ref.getTime() + 9 * 60 * 60 * 1000)
  return (
    jst.getUTCFullYear() === refJst.getUTCFullYear() &&
    jst.getUTCMonth() === refJst.getUTCMonth()
  )
}

export default function Home({ posts, diaryContentBySlug }: Props) {
  const router = useRouter()
  const pageTitle = SITE_NAME
  const metaTitle = SITE_NAME
  const canonicalUrl = buildSiteUrl('/')
  const onRowActivate = (e: React.MouseEvent | React.KeyboardEvent, slug: string) => {
    // If clicking an inner link, do nothing
    const target = e.target as Element
    if (target && target.closest('a')) return
    if ('key' in e) {
      const ke = e as React.KeyboardEvent
      if (ke.key !== 'Enter' && ke.key !== ' ') return
      ke.preventDefault()
    }
    router.push(`/${slug}`)
  }
  const tagSet = new Set<string>()
  for (const p of posts) {
    for (const t of p.tags || []) tagSet.add(t)
  }
  const tags = Array.from(tagSet).sort((a, b) => {
    const ai = TAG_ORDER.indexOf(a)
    const bi = TAG_ORDER.indexOf(b)
    const aw = ai === -1 ? Number.MAX_SAFE_INTEGER : ai
    const bw = bi === -1 ? Number.MAX_SAFE_INTEGER : bi
    if (aw !== bw) return aw - bw
    return a.localeCompare(b)
  })
  const grouped: Record<string, PostMeta[]> = {}
  for (const tag of tags) grouped[tag] = posts.filter((p) => (p.tags || []).includes(tag))
  const untagged = posts.filter((p) => !p.tags || p.tags.length === 0)

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Head>
      <main className="container">
        {tags.map((tag) => (
          <section key={tag} className="tag-section">
            <div className="category-box">
              <h3 className="category-title">{tag}</h3>
              <div>
                {tag === '日記' ? (
                  <>
                    {grouped[tag]
                      .filter((p) => isSameMonthJST(p.date))
                      .map((p) => (
                        <div
                          key={p.slug}
                          className="item-row item-row--diary"
                          role="link"
                          tabIndex={0}
                          onClick={(e) => onRowActivate(e, p.slug)}
                          onKeyDown={(e) => onRowActivate(e, p.slug)}
                        >
                          <div
                            className="item-body"
                            dangerouslySetInnerHTML={{ __html: diaryContentBySlug[p.slug] || '' }}
                          />
                          <span className="meta item-date">
                            <time dateTime={isoDateJST(p.date)}>{formatDateYYYYMD(p.date)}</time>
                          </span>
                        </div>
                      ))}
                    {grouped[tag]
                      .filter((p) => !isSameMonthJST(p.date))
                      .map((p) => (
                        <div key={p.slug} className="item-row">
                          <span className="item-title">
                            <Link href={`/${p.slug}`}>{p.title}</Link>
                          </span>
                        </div>
                      ))}
                  </>
                ) : (
                  grouped[tag].map((p) => (
                    <div key={p.slug} className="item-row">
                      <span className="item-title">
                        <Link href={`/${p.slug}`}>{p.title}</Link>
                      </span>
                      <span className="meta item-date">
                        <time dateTime={isoDateJST(p.date)}>{formatDateYYYYMD(p.date)}</time>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        ))}

        {untagged.length > 0 && (
          <section className="tag-section">
            <div className="category-box">
              <h3 className="category-title">タグなし</h3>
              <div>
                {untagged.map((p) => (
                  <div key={p.slug} className="item-row">
                    <span className="item-title">
                      <Link href={`/${p.slug}`}>{p.title}</Link>
                    </span>
                    <span className="meta item-date">
                      <time dateTime={isoDateJST(p.date)}>{formatDateYYYYMD(p.date)}</time>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPostsMeta()
  // Build content HTML for this month's diary posts
  const diarySlugs = posts
    .filter((p) => (p.tags || []).includes('日記') && isSameMonthJST(p.date))
    .map((p) => p.slug)
  const diaryContentBySlug: Record<string, string> = {}
  await Promise.all(
    diarySlugs.map(async (slug) => {
      const post = await getPostBySlug(slug)
      if (post?.contentHtml) diaryContentBySlug[slug] = post.contentHtml
    })
  )
  return { props: { posts, diaryContentBySlug } }
}
