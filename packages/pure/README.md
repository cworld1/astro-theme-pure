# Astro Theme Pure (Integration Package)

A simple, fast and powerful blog & document theme built by Astro.

[![GitHub deployments](https://img.shields.io/github/deployments/cworld1/astro-theme-pure/production?style=flat&logo=vercel&label=vercel)](https://astro-pure.js.org/)
[![NPM Version](https://img.shields.io/npm/v/astro-pure?style=flat)](https://www.npmjs.com/package/astro-pure)
[![GitHub License](https://img.shields.io/github/license/cworld1/astro-theme-pure?style=flat)](https://github.com/cworld1/astro-theme-pure/blob/main/LICENSE)

![img](https://github.com/user-attachments/assets/6c42b061-df7e-4696-a29b-bff07fe17d88)

## Usage

### Use with theme template

See [Getting Started](https://astro-pure.js.org/docs/setup/getting-started).

### Use with common Astro project

See [User Components](https://astro-pure.js.org/docs/integrations/components) & [Advanced Components](https://astro-pure.js.org/docs/integrations/advanced) to learn how to use.

> Some part of Advanced Components may require Astro Integration config.

#### UnoCSS

UnoCSS is more recommended, and TailwindCSS method will be removed soon.

#### TailwindCSS V3

Set up tailwindcss v3 in your project.

```js
// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // Add astro-pure components in the tailwindcss render config
    './node_modules/astro-pure/components/**/*.astro'
  ]
}

export default config
```

## Cli

```shell
# See all commands
astro-pure help
# Get the info of astro-pure
astro-pure info
# Create a new post in the blog
astro-pure new [options]
```

## License

This project is licensed under the Apache 2.0 License.
