// @ts-check

import pluginJs from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  // For JavaScript and TypeScript files in general
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,

  // Ignore files
  {
    ignores: ['public/scripts/*', 'scripts/*', '.astro/', 'src/env.d.ts']
  }
]
