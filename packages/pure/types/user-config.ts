import { z } from 'zod'

import { IntegrationConfigSchema } from './integrations-config'
import { ThemeConfigSchema } from './theme-config'

export const UserConfigSchema = ThemeConfigSchema()
  .strict()
  .merge(
    z.object({
      integ: IntegrationConfigSchema()
    })
  )
  .transform((config) => ({
    ...config,
    // Pagefind only defaults to true if prerender is also true.
    integ: {
      ...config.integ,
      pagefind: config.integ.pagefind ?? config.prerender
    }
  }))
  .refine((config) => !(config.integ.pagefind && !config.prerender), {
    message: 'Pagefind search is not supported with prerendering disabled.'
  })

export type UserConfig = z.infer<typeof UserConfigSchema>
export type UserInputConfig = z.input<typeof UserConfigSchema>
