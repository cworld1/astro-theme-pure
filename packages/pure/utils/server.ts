import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content'

type Collections = CollectionEntry<CollectionKey>[]

export const prod = import.meta.env.PROD

// Helper type for collections that have standard blog fields
type CollectionWithDate = {
  data: {
    updatedDate?: Date
    publishDate?: Date
    date?: Date // Support 'date' for trades
    tags?: string[]
    draft?: boolean
  }
}

/** Note: this function filters out draft posts based on the environment */
export async function getBlogCollection<T extends CollectionKey = 'blog'>(contentType: T = 'blog' as T) {
  return await getCollection(contentType, ({ data }: CollectionEntry<T>) => {
    // Not in production & draft is not false
    if ('draft' in data) {
      return prod ? !(data as any).draft : true
    }
    return true
  })
}

function getYearFromCollection<T extends CollectionKey>(
  collection: CollectionEntry<T>
): number | undefined {
  const data = collection.data as any
  const dateStr = data.updatedDate ?? data.publishDate ?? data.date
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

export function sortMDByDate<T extends CollectionKey>(collections: CollectionEntry<T>[]): CollectionEntry<T>[] {
  return collections.sort((a, b) => {
    const aData = a.data as any
    const bData = b.data as any
    const aDate = new Date(aData.updatedDate ?? aData.publishDate ?? aData.date ?? 0).valueOf()
    const bDate = new Date(bData.updatedDate ?? bData.publishDate ?? bData.date ?? 0).valueOf()
    return bDate - aDate
  })
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(collections: Collections) {
  return collections.flatMap((collection) => {
    const data = collection.data as any
    if (data.tags) {
      return [...data.tags]
    }
    return []
  })
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
