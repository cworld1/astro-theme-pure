import type { CollectionEntry } from 'astro:content'

/** Return each blog category with the number of posts assigned to it. */
export function getUniqueCategoriesWithCount(posts: CollectionEntry<'blog'>[]) {
  const categories = new Map<string, { category: string; count: number }>()

  for (const post of posts) {
    const postCategories = new Map<string, string>()
    for (const category of post.data.categories) {
      const key = category.toLowerCase()
      if (!postCategories.has(key)) postCategories.set(key, category)
    }

    for (const [key, category] of postCategories) {
      const current = categories.get(key)
      categories.set(key, {
        category: current?.category ?? category,
        count: (current?.count ?? 0) + 1
      })
    }
  }

  return Array.from(categories.values())
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category))
    .map(({ category, count }) => [category, count] as const)
}

export function getUniqueCategories(posts: CollectionEntry<'blog'>[]) {
  return getUniqueCategoriesWithCount(posts).map(([category]) => category)
}
