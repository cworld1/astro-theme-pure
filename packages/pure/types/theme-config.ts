import { z } from 'astro/zod'

import { FaviconSchema } from '../schemas/favicon'
import { HeadConfigSchema } from '../schemas/head'
import { HeaderMenuSchema } from '../schemas/header'
import { LocaleConfigSchema } from '../schemas/locale'
import { LogoConfigSchema } from '../schemas/logo'
import { ShareSchema } from '../schemas/share'
import { SocialLinksSchema } from '../schemas/social'

export const ThemeConfigSchema = () =>
  z.object({
    /** Title for your website. Will be used in metadata and as browser tab title. */
    title: z
      .string()
      .describe('Title for your website. Will be used in metadata and as browser tab title.'),

    /** Will be used in index page & copyright declaration */
    author: z.string().describe('Will be used in index page & copyright declaration'),

    /** Description metadata for your website. Can be used in page metadata. */
    description: z
      .string()
      .default('Built with Astro-Pure')
      .describe('Description metadata for your website. Can be used in page metadata.'),

    /** The default favicon for your site which should be a path to an image in the `public/` directory. */
    favicon: FaviconSchema(),

    /** The default social card image for your site which should be a path to an image in the `public/` directory. */
    socialCard: z
      .string()
      .default('/images/social-card.png')
      .describe(
        'The default social card image for your site which should be a path to an image in the `public/` directory.'
      ),

    /** Set a logo image to show in the homepage. */
    logo: LogoConfigSchema(),

    /** The tagline for your website. */
    tagline: z.string().optional().describe('The tagline for your website.'),

    /** Configure the defaults for the table of contents on each page. */
    //   tableOfContents: TableOfContentsSchema(),

    /**
     * Specify the default language for this site.
     *
     * The default locale will be used to provide fallback content where translations are missing.
     */
    locale: LocaleConfigSchema(),

    /**
     * Add extra tags to your site’s `<head>`.
     *
     * Can also be set for a single page in a page’s frontmatter.
     *
     * @example
     * // Add Fathom analytics to your site
     * starlight({
     *  head: [
     *    {
     *      tag: 'script',
     *      attrs: {
     *        src: 'https://cdn.usefathom.com/script.js',
     *        'data-site': 'MY-FATHOM-ID',
     *        defer: true,
     *      },
     *    },
     *  ],
     * })
     */
    head: HeadConfigSchema(),

    /**
     * Provide CSS files to customize the look and feel of your Starlight site.
     *
     * Supports local CSS files relative to the root of your project,
     * e.g. `'/src/custom.css'`, and CSS you installed as an npm
     * module, e.g. `'@fontsource/roboto'`.
     *
     * @example
     * starlight({
     *  customCss: ['/src/custom-styles.css', '@fontsource/roboto'],
     * })
     */
    customCss: z.string().array().optional().default([]),

    /** Will be used as title delimiter in the generated `<title>` tag. */
    titleDelimiter: z
      .string()
      .describe('Will be used as title delimiter in the generated `<title>` tag.')
      .default('•'),

    /**
     * Define whether Starlight pages should be prerendered or not.
     * Defaults to always prerender Starlight pages, even when the project is
     * set to "server" output mode.
     */
    prerender: z.boolean().default(true),

    /** The npm CDN to use for loading npm packages.
     * @example
     * npmCDN: 'https://cdn.jsdelivr.net/npm'
     * npmCDN: 'https://cdn.smartcis.cn/npm'
     * npmCDN: 'https://unkpg.com'
     * npmCDN: 'https://cdn.cbd.int'
     * npmCDN: 'https://esm.sh'
     */
    npmCDN: z
      .string()
      .default('https://esm.sh')
      .describe('The npm CDN to use for loading npm packages.'),

    /** Configure the header of your site. */
    header: z.object({
      /** The header menu items for your site.
       * @example
       * header: [
       *   { title: 'Home', link: '/' },
       *   { title: 'Blog', link: '/blog' }
       * ]
       */
      menu: HeaderMenuSchema()
    }),

    /** Configure the footer of your site. */
    footer: z.object({
      /** The footer content for your site. */
      year: z.string().describe('The footer content for your site.'),
      /** The footer links for your site. */
      links: z
        .array(
          z.object({
            /** Link title */
            title: z.string().describe('Link title'),
            /** Link URL */
            link: z.string().describe('Link URL'),
            /** Link style */
            style: z.string().optional().describe('Link style'),
            /** Link position */
            pos: z.number().default(1).describe('Link position')
          })
        )
        .optional()
        .describe('The footer links for your site.'),

      /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
      credits: z
        .boolean()
        .default(true)
        .describe('Enable displaying a “Built with Starlight” link in your site’s footer.'),

      /**
       * Optional details about the social media accounts for this site.
       *
       * @example
       * social: {
       *   discord: 'https://astro.build/chat',
       *   github: 'https://github.com/withastro/starlight',
       *   gitlab: 'https://gitlab.com/delucis',
       *   threads: 'https://www.threads.net/@nmoodev',
       *   twitch: 'https://www.twitch.tv/bholmesdev',
       *   twitter: 'https://twitter.com/astrodotbuild',
       *   youtube: 'https://youtube.com/@astrodotbuild',
       * }
       */
      social: SocialLinksSchema()
    }),

    content: z.object({
      externalLinks: z.object({
        /** Content to show for external links */
        content: z.string().optional().default(' ↗').describe('Content to show for external links'),
        /** Properties for the external links element */
        properties: z
          .record(z.string())
          .optional()
          .describe('Properties for the external links element')
      }),

      /** Blog page size for pagination */
      blogPageSize: z.number().optional().default(8),

      /** Share buttons to show */
      share: ShareSchema()
    })
  })

export type ThemeUserConfig = z.input<ReturnType<typeof ThemeConfigSchema>>
export type ThemeConfig = z.infer<ReturnType<typeof ThemeConfigSchema>>
