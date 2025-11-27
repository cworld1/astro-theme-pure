import type { AstroGlobal, ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'
import type { CollectionEntry } from 'astro:content'
import rss from '@astrojs/rss'
import type { Root } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import config from 'virtual:config'

import {
  getBlogCollectionByLocale,
  sortMDByDate,
  getLangStaticPaths
} from 'astro-pure/server'
import { normalizeLocaleBlogId } from 'astro-pure/utils'

export { getLangStaticPaths as getStaticPaths }
export const prerender = true

// Get dynamic import of images as a map collection
// Support images from both default and localized blog directories
const imagesGlob = {
  ...import.meta.glob<{ default: ImageMetadata }>(
    '/src/content/blog/**/*.{jpeg,jpg,png,gif,avif,webp}'
  ),
  ...import.meta.glob<{ default: ImageMetadata }>(
    '/src/content/localized/*/blog/**/*.{jpeg,jpg,png,gif,avif,webp}'
  )
}

const renderContent = async (post: CollectionEntry<'blog'>, site: URL) => {
  function remarkReplaceImageLink() {
    return async function (tree: Root) {
      const promises: Promise<void>[] = []
      visit(tree, 'image', (node) => {
        if (node.url.startsWith('/images')) {
          node.url = `${site}${node.url.replace('/', '')}`
        } else {
          const imagePathPrefix = `/src/content/${post.id}/${node.url.replace('./', '')}`
          const promise = imagesGlob[imagePathPrefix]?.().then(async (res) => {
            const imagePath = res?.default
            if (imagePath) {
              node.url = `${site}${(await getImage({ src: imagePath })).src.replace('/', '')}`
            }
          })
          if (promise) promises.push(promise)
        }
      })
      await Promise.all(promises)
    }
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkReplaceImageLink)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(post.body)

  return String(file)
}

const resolveHeroImageUrl = async (post: CollectionEntry<'blog'>, site: URL) => {
  const raw = post.data.heroImage?.src as string | ImageMetadata | undefined
  if (!raw) return undefined

  const toAbs = (p: string) => `${site}${p.replace(/^\/+/, '')}`
  const isExternal = (s: string) => /^https?:\/\//.test(s) || s.startsWith('//')

  if (typeof raw === 'string') {
    if (isExternal(raw)) return raw
    if (raw.startsWith('/')) return toAbs(raw)

    const rel = raw.replace('./', '')
    const key = `/src/content/${post.id}/${rel}`
    const mod = imagesGlob[key]
    if (mod) {
      const meta = (await mod())?.default
      if (meta) {
        const built = await getImage({ src: meta })
        return toAbs(built.src)
      }
    }
    return toAbs(raw)
  }

  const built = await getImage({ src: raw })
  return toAbs(built.src)
}

const GET = async (context: AstroGlobal) => {
  const currentLocale = (context.params?.lang as string) || 'en'
  const allPostsByDate = sortMDByDate(
    (await getBlogCollectionByLocale<'blog'>(currentLocale)) as CollectionEntry<'blog'>[]
  ) as CollectionEntry<'blog'>[]
  const siteUrl = context.site ?? new URL(import.meta.env.SITE)

  return rss({
    trailingSlash: false,
    xmlns: { h: 'http://www.w3.org/TR/html4/' },
    stylesheet: '/scripts/pretty-feed-v3.xsl',

    title: config.title,
    description: config.description,
    site: import.meta.env.SITE,
    items: await Promise.all(
      allPostsByDate.map(async (post: CollectionEntry<'blog'>) => {
        const hero = await resolveHeroImageUrl(post, siteUrl)
        return {
          pubDate: post.data.publishDate,
          link: `/${currentLocale}/blog/${normalizeLocaleBlogId(post.id)}`,
          customData:
            hero
              ? `<h:img src="${hero}" />\n          <enclosure url="${hero}" />`
              : undefined,
          content: await renderContent(post, siteUrl),
          ...post.data
        }
      })
    )
  })
}

export { GET }
