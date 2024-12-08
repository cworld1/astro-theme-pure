import { z } from 'astro/zod'

export const shareList = ['weibo', 'x', 'bluesky'] as const

export const ShareSchema = () =>
  z
    .array(z.enum(shareList))
    .default(['bluesky'])
    .describe('Options for sharing content on social media platforms.')
