import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

function removeDupsAndLowerCase(array: string[]) {
  if (!array.length) return array
  const lowercaseItems = array.map((str) => str.toLowerCase())
  const distinctItems = new Set(lowercaseItems)
  return Array.from(distinctItems)
}

// Define blog collection
const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Required
  schema: ({ image }) =>
    z.object({
      // Required
      title: z.string().max(120),
      description: z.string().max(160),
      publishDate: z.coerce.date(),
      // Optional
      updatedDate: z.coerce.date().optional(),
      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional(),
          inferSize: z.boolean().optional(),
          width: z.number().optional(),
          height: z.number().optional(),

          color: z.string().optional()
        })
        .optional(),
      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      language: z.string().optional(),
      draft: z.boolean().default(false),
      // Special fields
      comment: z.boolean().default(true)
    }).strict()
})

// Define stocks collection for trading journal
const stocks = defineCollection({
  loader: glob({ base: './src/content/stocks', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      // Basic Info
      title: z.string().max(120),
      description: z.string().max(160),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      // Trading Specific Fields
      ticker: z.string(), // Stock ticker symbol (e.g., "TCL", "NVO")
      market: z.string().optional(), // Market (e.g., "A-Share", "NASDAQ")
      entryPrice: z.number().optional(), // Entry price
      exitPrice: z.number().optional(), // Exit price
      entryDate: z.coerce.date().optional(), // Entry date
      exitDate: z.coerce.date().optional(), // Exit date
      position: z.enum(['long', 'short']).default('long'),
      status: z.enum(['open', 'closed', 'partial']).default('closed'),
      profitLoss: z.number().optional(), // P&L in percentage

      // Display
      heroImage: z
        .object({
          src: image(),
          alt: z.string().optional(),
          inferSize: z.boolean().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
          color: z.string().optional()
        })
        .optional(),

      tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
      language: z.string().optional(),
      draft: z.boolean().default(false),
      comment: z.boolean().default(true)
    }).strict()
})

export const collections = { blog, stocks }
