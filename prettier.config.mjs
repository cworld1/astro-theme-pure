// @ts-check

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  jsxSingleQuote: true,
  printWidth: 100,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: false,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false,

  // Prettier plugins
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports'
  ],
  importOrder: [
    '^(astro$)|^(astro:(.*)$)',
    '^@astrojs/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^astro-pure/(.*)$',
    '^@/types/(.*)$',
    '^@/layouts/(.*)$',
    '^@/pages/(.*)$',
    '^@/components/(.*)$',
    '^@/utils$',
    '^@/utils/(.*)$',
    '^@/plugins/(.*)$',
    '^@/assets/(.*)$',
    '^@/site-config$',
    '',
    '^[./]'
  ],
  importOrderParserPlugins: ['astro', 'typescript', 'jsx', 'decorators-legacy'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
}
