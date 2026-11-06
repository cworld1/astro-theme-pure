import { z } from 'astro/zod'

import { IconSchema } from './icon'

const LinksSchema = z
  .object({ icon: IconSchema(), label: z.string().min(1), href: z.string() })
  .array()
  .optional()

export const SocialLinksSchema = () =>
  // Add a more specific error message to help people migrate from the old object syntax.
  // TODO: remove once most people have updated to v0.33 or higher (e.g. when releasing Starlight v1)
  z.preprocess((value, ctx) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      ctx.issues.push({
        code: 'custom',
        message:
          'Theme v4.1.5 changed the `social` configuration syntax. Please specify an array of link items instead of an object.',
        input: value
      })
    }
    return value
  }, LinksSchema) as unknown as typeof LinksSchema
