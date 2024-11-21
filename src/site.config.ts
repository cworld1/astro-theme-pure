import type { SiteConfig, MenuLinks, SocialLinks } from '@/types'

export const siteConfig: SiteConfig = {
  // Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
  author: 'Horizon Moon',
  // Meta property used to construct the meta title property, found in src/components/BaseHead.astro L:11
  title: 'My Blog',
  // Meta property used to generate your sitemap and canonical URLs in your final build
  site: 'https://astro-theme-pure.vercel.app',
  // Meta property used as the default description meta property
  description: 'Stay hungry, stay foolish',
  // HTML lang property, found in src/layouts/Base.astro L:18
  lang: 'zh-CN, en-US',
  // Meta property, found in src/components/BaseHead.astro L:42
  ogLocale: 'zh-CN',
  // Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
  date: {
    locale: 'zh-CN',
    options: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  // Customize
  pageSize: 8,
  externalLinkArrow: true,
  registration: {
    url: 'https://icp.gov.moe/?keyword=APTX4869',
    text: '萌ICP备APTX4869号'
  },
  walineServerUrl: 'https://astro-theme-pure-waline.arthals.ink',
  applyFriendTip: {
    name: 'Astro Theme Pure',
    slogan: '求知若愚，虚怀若谷',
    url: 'https://astro-theme-pure.vercel.app/',
    avatar: 'https://cravatar.cn/avatar/1ffe42aa45a6b1444a786b1f32dfa8aa?s=200'
  }
}

// will be used in Footer.astro
export const socialLinks: SocialLinks = [
  // {
  //   name: 'mail',
  //   url: 'mailto:test@example.com'
  // },
  {
    name: 'github',
    url: 'https://github.com/cworld1/astro-theme-pure'
  }
]

export const menuLinks: MenuLinks = [
  {
    link: '/blog',
    label: 'Blog'
  },
  {
    link: '/projects',
    label: 'Projects'
  },
  {
    link: '/links',
    label: 'Links'
  },
  {
    link: '/about',
    label: 'About'
  }
]
