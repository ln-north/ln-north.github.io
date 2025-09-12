import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import { getAllPostsMeta, type PostMeta } from '../lib/posts'

type Props = {
  posts: PostMeta[]
}

export default function Home({ posts }: Props) {
  return (
    <>
      <Head>
        <title>ブログ</title>
      </Head>
      <main style={{ maxWidth: 760, margin: '2rem auto', padding: '0 1rem' }}>
        <h1>記事一覧</h1>
        <ul>
          {posts.map((p) => (
            <li key={p.slug} style={{ marginBottom: '1rem' }}>
              <Link href={`/${p.slug}`}>
                {p.title}
              </Link>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                <time dateTime={p.date}>{new Date(p.date).toLocaleDateString('ja-JP')}</time>
                {p.tags?.length ? (
                  <> ・ タグ: {p.tags.join(', ')}</>
                ) : null}
              </div>
              {p.excerpt ? (
                <p style={{ marginTop: '.25rem' }}>{p.excerpt}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPostsMeta()
  return { props: { posts } }
}

