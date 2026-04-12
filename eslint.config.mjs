// @ts-check
import eslintPluginAstro from 'eslint-plugin-astro'
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...eslintPluginAstro.configs.recommended,
  // Ignore files
  {
    ignores: ['public/scripts/*', 'scripts/*', '.astro/', 'src/env.d.ts'],
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    }
  }
])
