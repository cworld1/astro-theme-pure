import { fileURLToPath } from 'node:url'
// Astro
import type { AstroIntegration, RehypePlugins, RemarkPlugins } from 'astro'
// Integrations
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import UnoCSS from '@unocss/astro'
import { AstroError } from 'astro/errors'

import * as pagefind from 'pagefind'
import rehypeExternalLinks from './plugins/rehype-external-links'
import rehypeImageCaption from './plugins/rehype-image-caption'
import { remarkAddZoomable, remarkReadingTime } from './plugins/remark-plugins'
import { vitePluginUserConfig } from './plugins/virtual-user-config'
import { UserConfigSchema, type UserInputConfig } from './types/user-config'
import { parseWithFriendlyErrors } from './utils/error-map'

export default function AstroPureIntegration(opts: UserInputConfig): AstroIntegration {
  if (typeof opts !== 'object' || opts === null || Array.isArray(opts))
    throw new AstroError(
      'Invalid config passed to astro-pure integration',
      'The astro-pure integration expects a right configuration object with at least a `title` property.\n\n'
    )
  const integrations: AstroIntegration[] = []
  const remarkPlugins: RemarkPlugins = []
  const rehypePlugins: RehypePlugins = []

  return {
    name: 'astro-pure',
    hooks: {
      'astro:config:setup': async ({ config, updateConfig }) => {
        const userConfig = parseWithFriendlyErrors(
          UserConfigSchema,
          opts,
          'Invalid config passed to astro-pure integration'
        )

        // Add built-in integrations only if they are not already added by the user through the
        // config or by a plugin.
        const allIntegrations = [...config.integrations, ...integrations]
        if (!allIntegrations.find(({ name }) => name === '@astrojs/sitemap')) {
          integrations.push(sitemap())
        }
        if (!allIntegrations.find(({ name }) => name === '@astrojs/mdx')) {
          integrations.push(mdx({ optimize: true }))
        }
        if (!allIntegrations.find(({ name }) => name === 'unocss')) {
          integrations.push(UnoCSS({ injectReset: true }))
        }

        // Add supported remark plugins based on user config.
        if (userConfig.integ.mediumZoom.enable)
          remarkPlugins.push([remarkAddZoomable, userConfig.integ.mediumZoom.options])
        remarkPlugins.push(remarkReadingTime)

        // Add supported rehype plugins based on user config.
        rehypePlugins.push([
          rehypeExternalLinks,
          {
            content: { type: 'text', value: userConfig.content.externalLinks.content },
            contentProperties: userConfig.content.externalLinks.properties
          }
        ])
        // Add image caption support
        if (userConfig.content.imageCaption) rehypePlugins.push(rehypeImageCaption)

        // Add integrations immediately after Starlight in the config array.
        // This ensures users can add integrations before/after Starlight and we respect that order.
        const selfIndex = config.integrations.findIndex((i) => i.name === 'astro-pure')
        config.integrations.splice(selfIndex + 1, 0, ...integrations)

        updateConfig({
          vite: {
            // @ts-ignore
            plugins: [vitePluginUserConfig(userConfig, config)]
          },
          markdown: {
            remarkPlugins,
            rehypePlugins
            // rehypePlugins: [rehypeRtlCodeSupport()],
            // shikiConfig:
            // Configure Shiki theme if the user is using the default github-dark theme.
            //   config.markdown.shikiConfig.theme !== 'github-dark' ? {} : { theme: 'css-variables' }
          },
          scopedStyleStrategy: 'where',
          // If not already configured, default to prefetching all links on hover.
          prefetch: config.prefetch ?? { prefetchAll: true }
        })
      },

      'astro:build:done': async ({ dir }) => {
        // Pagefind index hook
        if (!opts.integ.pagefind) return
        try {
          const targetDir = fileURLToPath(dir)
          
          // Create index
          const { index } = await pagefind.createIndex()
          if (!index) {
            throw new Error('Failed to create Pagefind index')
          }

          // Write index files to the `./pagefind/`
          await index.addDirectory({ path: targetDir })
          await index.writeFiles({
            outputPath: fileURLToPath(new URL('./pagefind/', dir))
          })
        } finally {
          await pagefind.close()
        }
      }
    }
  }
}
