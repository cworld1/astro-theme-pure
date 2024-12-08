// @ts-check

import { rehypeHeadingIds } from '@astrojs/markdown-remark'
// Adapter
import vercel from '@astrojs/vercel'
// Integrations
import icon from 'astro-icon'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'
// Rehype & remark packages
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// import { visualizer } from 'rollup-plugin-visualizer'

// import { pagefindConfig } from './src/plugins/pagefind.ts'
// Local rehype & remark plugins
import rehypeAutolinkHeadings from './src/plugins/rehypeAutolinkHeadings.ts'
// Markdown
import { remarkArxivCards, remarkReadingTime } from './src/plugins/remarkPlugins.ts'
// Shiki
import {
  addCopyButton,
  addLanguage,
  addTitle,
  transformerNotationDiff,
  transformerNotationHighlight,
  updateStyle
} from './src/plugins/shikiTransformers.ts'
import config from './src/site.config.ts'

// https://astro.build/config
export default defineConfig({
  // Top-Level Options
  site: 'https://astro-docs.vercel.app',
  // base: '/docs',
  trailingSlash: 'never',

  // Adapter
  // 1. Vercel (serverless)
  adapter: vercel(),
  output: 'server',
  // 2. Vercel (static)
  // adapter: vercelStatic(),
  // 3. Local (standalone)
  // adapter: node({ mode: 'standalone' }),
  // ---

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  integrations: [
    icon(),
    // astro-pure will automatically add sitemap, mdx & tailwind
    // sitemap(),
    // mdx(),
    // tailwind({ applyBaseStyles: false }),
    AstroPureIntegration(config)
    // (await import('@playform/compress')).default({
    //   SVG: false,
    //   Exclude: ['index.*.js']
    // }),
    // pagefindConfig()
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
    remarkPlugins: [remarkReadingTime, remarkMath, remarkArxivCards],
    rehypePlugins: [
      [rehypeKatex, {}],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000)
      ]
    }
  }
  // vite: {
  //   plugins: [
  //     visualizer({
  //       emitFile: true,
  //       filename: 'stats.html'
  //     })
  //   ]
  // }
})
