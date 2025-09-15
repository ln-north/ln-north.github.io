import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { getAllSlugs, getPostBySlug, type Post } from '../lib/posts'
import { formatDateYYYYMD, isoDateJST } from '../lib/formatDate'
import { loadDefaultJapaneseParser } from 'budoux'

type Props = {
  post: Post
}

export default function PostPage({ post }: Props) {
  const parser = loadDefaultJapaneseParser()
  const titleChunks = parser.parse(post.title)
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className="container">
        <header className="post-header">
          <h1>
            {titleChunks.map((c, i) => (
              <React.Fragment key={i}>
                {c}
                {i < titleChunks.length - 1 ? <wbr /> : null}
              </React.Fragment>
            ))}
          </h1>
          <div className="meta">
            <time dateTime={isoDateJST(post.date)}>{formatDateYYYYMD(post.date)}</time>
            {post.tags?.length ? <> ・ {post.tags.join(', ')}</> : null}
          </div>
        </header>
        <article className="post-article" dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} />
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
