import { z } from 'astro/zod'

export const socialLinks = [
  'github',
  'gitlab',
  'discord',
  'youtube',
  'instagram',
  'x',
  'telegram',
  'rss',
  'email',
  'reddit',
  'bluesky',
  'tiktok'
] as const

export const SocialLinksSchema = () =>
  z
    .record(
      z.enum(socialLinks),
      // Link to the respective social profile for this site
      z.string().url()
    )
    .transform((links) => {
      const labelledLinks: Partial<Record<keyof typeof links, { label: string; url: string }>> = {}
      for (const _k in links) {
        const key = _k as keyof typeof links
        const url = links[key]
        if (!url) continue
        const label = {
          github: 'GitHub',
          gitlab: 'GitLab',
          discord: 'Discord',
          youtube: 'YouTube',
          instagram: 'Instagram',
          x: 'X',
          telegram: 'Telegram',
          rss: 'RSS',
          email: 'Email',
          reddit: 'Reddit',
          bluesky: 'BlueSky',
          tiktok: 'TikTok'
        }[key]
        labelledLinks[key] = { label, url }
      }
      return labelledLinks
    })
    .optional()
