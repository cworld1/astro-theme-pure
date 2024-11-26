export const prod = import.meta.env.PROD

// Tailwind
export { cn } from './tailwind'

// Collections
export {
  getAllCollections,
  groupCollectionsByYear,
  sortMDByDate,
  getUniqueTags,
  getUniqueTagsWithCount
} from './collections'

// Date
export { getFormattedDate } from './date'

// Generate Toc
export { generateToc } from './generateToc'
export type { TocItem } from './generateToc'

// Link Preview
export { safeGetDOM, parseOpenGraph } from './link-preview'

export { fetchGitHubApi, fetchArxivApi } from './api'