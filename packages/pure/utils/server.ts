import { i18n } from 'astro:config/client'
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content'
import { toPaths as getConfiguredLocalePaths, getLocaleByPath } from 'astro:i18n'
import config from 'virtual:config'

import { getBaseLocale, mergeContentLocale } from './locale'

type Collections = CollectionEntry<CollectionKey>[]

export const prod = import.meta.env.PROD

const loadedContentLocales = new Set<string>()

const hasUserI18nFiles =
  Object.keys(import.meta.glob('/src/content/i18n/**/*.json', { eager: false })).length > 0

/** Note: this function filters out draft posts based on the environment */
export async function getBlogCollection<T extends CollectionKey = 'blog'>(
  contentType: T = 'blog' as T
) {
  return await getCollection(contentType, (entry: CollectionEntry<T>) => {
    const draft = (entry.data as { draft?: boolean }).draft
    return prod ? !draft : true
  })
}

/**
 * Locale-aware version of `getBlogCollection`.
 * - Filters out draft posts based on environment (same as `getBlogCollection`).
 * - When `locale` is provided, only returns entries whose `data.language` matches the base locale.
 */
export async function getBlogCollectionByLocale<T extends CollectionKey = 'blog'>(
  locale?: string,
  contentType: T = 'blog' as T
) {
  const targetBase = locale ? getBaseLocale(locale) : undefined
  return await getCollection(contentType, ({ data, id }: CollectionEntry<T>) => {
    const draftOk = prod ? !(data as { draft?: boolean }).draft : true
    if (!draftOk) return false

    if (!targetBase) return true

    const m = id?.match(/^localized\/([^/]+)\//i)
    if (m) return getBaseLocale(m[1]).toLowerCase() === targetBase.toLowerCase()

    if ('lang' in (data as any) && (data as { lang?: string }).lang) {
      const entryBase = getBaseLocale((data as { lang?: string }).lang as string)
      return entryBase.toLowerCase() === targetBase.toLowerCase()
    }

    const defaultBase = getBaseLocale(config.locale?.lang as string)
    return targetBase?.toLowerCase() === defaultBase.toLowerCase()
  })
}

export async function ensureContentI18nLoaded(locale: string) {
  if (!locale || loadedContentLocales.has(locale)) return
  if (!hasUserI18nFiles) {
    loadedContentLocales.add(locale)
    return
  }
  let entries: CollectionEntry<CollectionKey>[] = []
  try {
    entries = (await getCollection(
      'i18n' as CollectionKey,
      (entry: CollectionEntry<CollectionKey>) => entry.id?.startsWith(`${locale}/`)
    )) 
  } catch {
    loadedContentLocales.add(locale)
    return
  }
  if (!entries.length) {
    loadedContentLocales.add(locale)
    return
  }
  for (const entry of entries) {
    const parts = String(entry.id).split('/')
    const ns = (parts[1] || '').replace(/\.json$/i, '') || 'common'
    mergeContentLocale(locale, ns, entry.data as Record<string, any>)
  }
  loadedContentLocales.add(locale)
}

function getYearFromCollection<T extends CollectionKey>(
  collection: CollectionEntry<T>
): number | undefined {
  const data = collection.data as { updatedDate?: Date; publishDate?: Date }
  const d = data.updatedDate ?? data.publishDate
  return d?.getFullYear()
}
export function groupCollectionsByYear<T extends CollectionKey>(
  collections: Collections
): [number, CollectionEntry<T>[]][] {
  const collectionsByYear = collections.reduce((acc, collection) => {
    const year = getYearFromCollection(collection)
    if (year !== undefined) {
      if (!acc.has(year)) {
        acc.set(year, [])
      }
      acc.get(year)!.push(collection)
    }
    return acc
  }, new Map<number, Collections>())

  return Array.from(
    collectionsByYear.entries() as IterableIterator<[number, CollectionEntry<T>[]]>
  ).sort((a, b) => b[0] - a[0])
}

export function sortMDByDate(collections: Collections): Collections {
  return collections.sort((a, b) => {
    const ad = a.data as { updatedDate?: Date; publishDate?: Date }
    const bd = b.data as { updatedDate?: Date; publishDate?: Date }
    const aDate = (ad.updatedDate ?? ad.publishDate)?.valueOf() ?? 0
    const bDate = (bd.updatedDate ?? bd.publishDate)?.valueOf() ?? 0
    return bDate - aDate
  })
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(collections: Collections) {
  return collections.flatMap((collection) => [
    ...((collection.data as { tags?: string[] }).tags || [])
  ])
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags(collections: Collections) {
  return [...new Set(getAllTags(collections))]
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount(collections: Collections): [string, number][] {
  return [
    ...getAllTags(collections).reduce(
      (acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
      new Map<string, number>()
    )
  ].sort((a, b) => b[1] - a[1])
}

export async function getLangLocales() {
  const all = getConfiguredLocalePaths(i18n?.locales ?? [])
  const prefixDefault =
    typeof i18n?.routing === 'object' ? i18n.routing.prefixDefaultLocale : false
  const def = i18n?.defaultLocale ?? (config.locale?.lang as string) ?? 'en'
  return prefixDefault ? all : all.filter((l) => getBaseLocale(l) !== getBaseLocale(def))
}

export async function getLangStaticPaths() {
  const locales = await getLangLocales()
  return locales.map((lang) => ({ params: { lang } }))
}

export function stripLocaleAndBasePathPrefixes(path: string) {
  return stripLocale(stripBase(path, import.meta.env.BASE_URL))
}

function stripBase(path: string, rawBase?: string): string {
  const raw = rawBase || '/'
  const tmp = '/' + raw.replace(/^\/+|\/+$/g, '')
  const base = tmp === '//' ? '/' : tmp

  if (base === '/') return path
  if (path === base) return '/'
  const pref = base + '/'
  if (path.startsWith(pref)) return path.slice(base.length)

  return path
}

function stripLocale(path: string): string {
  const parts = path.split('/')

  const idx = parts.findIndex((seg, i) => {
    if (i === 0 || !seg) return false
    try {
      return !!getLocaleByPath(seg)
    } catch {
      return false
    }
  })

  if (idx > 0) {
    parts.splice(idx, 1)
  }

  let out = parts.join('/') || '/'
  if (!out.startsWith('/')) out = '/' + out
  return out
}
