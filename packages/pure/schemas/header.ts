import { z } from 'astro/zod'

const MenuItemSchema = z.object({
  title: z.string(),
  link: z.string()
})

export const HeaderMenuSchema = () =>
  z
    .array(MenuItemSchema)
    .default([
      { title: 'Blog', link: '/blog' },
      { title: 'Projects', link: '/projects' },
      { title: 'Links', link: '/links' },
      { title: 'About', link: '/about' }
    ])
    .or(z.record(z.string(), z.array(MenuItemSchema)))
    .describe('The header menu items for your site.')
