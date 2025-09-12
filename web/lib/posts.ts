import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { markdownToHtml } from './markdownToHtml'

export type PostMeta = {
  title: string
  slug: string
  date: string
  tags: string[]
  excerpt?: string
}

export type Post = PostMeta & {
  content: string
  contentHtml?: string
}

const postsDirectory = path.join(process.cwd(), '..', 'content', '_posts')

function isMarkdownFile(file: string): boolean {
  return file.toLowerCase().endsWith('.md')
}

function filenameToSlug(filename: string): string {
  const name = filename.replace(/\.md$/i, '')
  // strip leading YYYY-MM-DD-
  const m = name.match(/^\d{4}-\d{2}-\d{2}-(.*)$/)
  return m ? m[1] : name
}

function filenameDate(filename: string): string | undefined {
  const m = filename.match(/^(\d{4}-\d{2}-\d{2})-/)
  return m ? m[1] : undefined
}

function readAllPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs.readdirSync(postsDirectory).filter(isMarkdownFile)
}

export function getAllPostsMeta(): PostMeta[] {
  const files = readAllPostFiles()
  const items = files.map((file) => {
    const fullPath = path.join(postsDirectory, file)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const slug = filenameToSlug(file)
    const date = (data.date
      ? new Date(data.date)
      : filenameDate(file)
      ? new Date(filenameDate(file) as string)
      : new Date()
    ).toISOString()
    const title: string = data.title || slug
    const tags: string[] = Array.isArray(data.tags) ? data.tags : []
    const excerpt: string | undefined = data.excerpt || content.split(/\n\n/)[0]
    const meta: PostMeta = { title, slug, date, tags, excerpt }
    return meta
  })
  // sort by date desc
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return items
}

export function getAllSlugs(): string[] {
  return readAllPostFiles().map(filenameToSlug)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const files = readAllPostFiles()
  const file = files.find((f) => filenameToSlug(f) === slug)
  if (!file) return null
  const fullPath = path.join(postsDirectory, file)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const date = (data.date
    ? new Date(data.date)
    : filenameDate(file)
    ? new Date(filenameDate(file) as string)
    : new Date()
  ).toISOString()
  const title: string = data.title || slug
  const tags: string[] = Array.isArray(data.tags) ? data.tags : []
  const excerpt: string | undefined = data.excerpt || content.split(/\n\n/)[0]
  const contentHtml = await markdownToHtml(content)
  return { title, slug, date, tags, excerpt, content, contentHtml }
}

