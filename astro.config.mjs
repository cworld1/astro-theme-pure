import { defineConfig } from 'astro/config'

// Adapter
// if you want deploy on vercel
import vercel from '@astrojs/vercel/serverless'
// if you want deploy locally
// import node from '@astrojs/node'
// ---

// Integrations
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'
// Markdown
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkMath from 'remark-math'
import { siteConfig } from './src/site.config.ts'
import { addCopyButton, addTitle, addLanguage, updateStyle } from './src/utils/shiki.ts'
import { remarkGithubCards, remarkReadingTime, remarkArxivCards } from './src/utils/remarkParser.ts'


// https://astro.build/config
export default defineConfig({
  // Top-Level Options
  site: siteConfig.site,
  // base: '/docs',
  trailingSlash: 'never',
  output: 'server',

  // Adapter
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  // if you want deploy locally
  // adapter: node({
  //   mode: 'standalone'
  // }),
  // ---

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    },
  },

  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    mdx(),
    icon(),
    (await import('@playform/compress')).default({
      SVG: false,
      Exclude: ['index.*.js']
    })
  ],
  // root: './my-project-directory',

  // Prefetch Options
  prefetch: true,
  // Server Options
  server: {
    host: true
  },
  // Markdown Options
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkAlert,
      remarkGithubCards,
      remarkArxivCards
    ],
    rehypePlugins: [
      [rehypeKatex, {}],
      [
        rehypeExternalLinks,
        {
          ...(siteConfig.externalLinkArrow && { content: { type: 'text', value: ' ↗' } }),
          target: '_blank',
          rel: ['nofollow, noopener, noreferrer']
        }
      ]
    ],
    // remarkRehype: { },
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [updateStyle(), addTitle(), addLanguage(), addCopyButton(2000)]
    }
  }
})
