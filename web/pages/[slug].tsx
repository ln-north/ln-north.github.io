import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { getAllSlugs, getPostBySlug, type Post } from '../lib/posts'

type Props = {
  post: Post
}

export default function PostPage({ post }: Props) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main style={{ maxWidth: 760, margin: '2rem auto', padding: '0 1rem' }}>
        <p>
          <Link href="/">← 戻る</Link>
        </p>
        <h1>{post.title}</h1>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>
          <time dateTime={post.date}>{new Date(post.date).toLocaleString('ja-JP')}</time>
          {post.tags?.length ? <> ・ タグ: {post.tags.join(', ')}</> : null}
        </div>
        <article
          style={{ marginTop: '1rem' }}
          dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
        />
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug as string
  const post = await getPostBySlug(slug)
  if (!post) return { notFound: true }
  return { props: { post } }
}

