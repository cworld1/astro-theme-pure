import { z } from 'astro/zod'

export const LocaleConfigSchema = () =>
  z.object({
    /** Html lang attribute */
    lang: z.string().default('en-US'),
    /** Head og meta locale */
    attrs: z.string().default('en_US'),
    dateLocale: z.string().default('en-US'),
    dateOptions: z
      .object({
        localeMatcher: z.enum(['best fit', 'lookup']).optional(),
        weekday: z.enum(['narrow', 'short', 'long']).optional(),
        era: z.enum(['narrow', 'short', 'long']).optional(),
        year: z.enum(['numeric', '2-digit']).optional(),
        month: z.enum(['numeric', '2-digit', 'narrow', 'short', 'long']).optional(),
        day: z.enum(['numeric', '2-digit']).optional(),
        hour: z.enum(['numeric', '2-digit']).optional(),
        minute: z.enum(['numeric', '2-digit']).optional(),
        second: z.enum(['numeric', '2-digit']).optional(),
        timeZoneName: z.enum(['short', 'long']).optional(),
        formatMatcher: z.enum(['best fit', 'basic']).optional(),
        hour12: z.boolean().optional(),
        timeZone: z.string().optional()
      })
      .default({})
  })

export type LocaleConfig = z.output<ReturnType<typeof LocaleConfigSchema>>
