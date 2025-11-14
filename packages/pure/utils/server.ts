import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content'
import { getBaseLocale } from './locale'

type Collections = CollectionEntry<CollectionKey>[]

export const prod = import.meta.env.PROD

/** Note: this function filters out draft posts based on the environment */
export async function getBlogCollection(contentType: CollectionKey = 'blog') {
  return await getCollection(contentType, ({ data }: CollectionEntry<typeof contentType>) => {
    // Not in production & draft is not false
    return prod ? !data.draft : true
  })
}

/**
 * Locale-aware version of `getBlogCollection`.
 * - Filters out draft posts based on environment (same as `getBlogCollection`).
 * - When `locale` is provided, only returns entries whose `data.language` matches the base locale.
 */
export async function getBlogCollectionByLocale(
  locale?: string,
  contentType: CollectionKey = 'blog'
) {
  const targetBase = locale ? getBaseLocale(locale) : undefined
  return await getCollection(
    contentType,
    ({ data, id }: CollectionEntry<typeof contentType>) => {
      const draftOk = prod ? !data.draft : true
      if (!draftOk) return false

      // If no locale provided, return all (respecting draft filter)
      if (!targetBase) return false

      let entryBase: string | undefined
      if ('lang' in data && data.lang) {
        entryBase = getBaseLocale(data.lang)
      } else {
        const m = id?.match(/^localized\/(\w+?)\//i)
        entryBase = m ? getBaseLocale(m[1]) : getBaseLocale()
      }

      return entryBase?.toLowerCase() === targetBase.toLowerCase()
    }
  )
}

function getYearFromCollection<T extends CollectionKey>(
  collection: CollectionEntry<T>
): number | undefined {
  const dateStr = collection.data.updatedDate ?? collection.data.publishDate
  return dateStr ? new Date(dateStr).getFullYear() : undefined
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
    const aDate = new Date(a.data.updatedDate ?? a.data.publishDate ?? 0).valueOf()
    const bDate = new Date(b.data.updatedDate ?? b.data.publishDate ?? 0).valueOf()
    return bDate - aDate
  })
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(collections: Collections) {
  return collections.flatMap((collection) => [...collection.data.tags])
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
