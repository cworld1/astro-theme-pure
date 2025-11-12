import { z } from 'astro/zod'

export const LogoConfigSchema = () =>
  z.object({
    /** Source of the image file to use. */
    src: z.string(),
    /** Alternative text description of the logo. */
    alt: z.string().default('')
  })

export type LogoUserConfig = z.input<ReturnType<typeof LogoConfigSchema>>
export type LogoConfig = z.output<ReturnType<typeof LogoConfigSchema>>
