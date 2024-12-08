import { z } from 'astro/zod'

export const LogoConfigSchema = () =>
  z
    .union([
      z.object({
        /** Source of the image file to use. */
        src: z.string(),
        /** Alternative text description of the logo. */
        alt: z.string().default('')
      }),
      z.object({
        /** Source of the image file to use in dark mode. */
        dark: z.string(),
        /** Source of the image file to use in light mode. */
        light: z.string(),
        /** Alternative text description of the logo. */
        alt: z.string().default('')
      })
    ])
    .optional()

export type LogoUserConfig = z.input<ReturnType<typeof LogoConfigSchema>>
export type LogoConfig = z.output<ReturnType<typeof LogoConfigSchema>>
