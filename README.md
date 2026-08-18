# Astro Theme Pure

English | [简体中文](./README-zh-CN.md)

A simple, fast and powerful blog & document theme built by Astro.

[![GitHub deployments](https://img.shields.io/github/deployments/cworld1/astro-theme-pure/production?style=flat&logo=vercel&label=vercel)](https://astro-pure.js.org/)
[![NPM Version](https://img.shields.io/npm/v/astro-pure?logo=npm&style=flat)](https://www.npmjs.com/package/astro-pure)
[![GitHub Release](https://img.shields.io/github/v/release/cworld1/astro-theme-pure?include_prereleases&style=flat&label=template)](https://github.com/cworld1/astro-theme-pure/releases)
[![GitHub License](https://img.shields.io/github/license/cworld1/astro-theme-pure?style=flat)](https://github.com/cworld1/astro-theme-pure/blob/main/LICENSE)

![image](./.github/assets/header.webp)
![image](./.github/assets/body.webp)

> [!NOTE]
> Known issues: Header & customize options is still under development (template exposed still).

## Introduction

Checkout [Demo Site →](https://astro-pure.js.org/)

### :fire: Features

- [x] :rocket: Fast & high performance
- [x] :star: Simple & clean design
- [x] :iphone: Responsive design
- [x] :mag: Full-site search built with [pagefind](https://pagefind.app/)
- [x] :world_map: Sitemap & RSS feed
- [x] :spider_web: SEO-friendly
- [x] :book: TOC (table of contents)
- [x] :framed_picture: Dynamic open graph generation for posts
- [x] :framed_picture: Mediumzoom lightbox for images

### :package: Components

Theme includes a lot of components, which can not only be used in the theme, but also in other astro projects.

> For other astro projects, UnoCSS is required. See [Package README](https://github.com/cworld1/astro-theme-pure/blob/main/packages/pure/README.md#use-with-common-astro-project) for more details.

- Basic components: `Aside`, `Tabs`, `Timeline`, `Steps`, `Spoiler`...
- Advanced components: `GithubCard`, `LinkPreview`, `Quote`, `QRCode`...

### :white_check_mark: Lighthouse score

[![lighthouse-score](./.github/assets/lighthouse-score.png)](https://pagespeed.web.dev/analysis/https-cworld-top/o229zrt5o4?form_factor=mobile&hl=en)

## Documentation

[Docs](https://astro-pure.js.org/docs) | [Showcase](https://github.com/cworld1/astro-theme-pure/issues/10)

## Package

See [astro-theme-pure](https://www.npmjs.com/package/astro-pure) on npm.

## Local development

### Environment requirements

> [!WARNING]
> Astro 6.0+ requires Node.js 22.12.0 or newer. Odd-numbered Node.js versions such as 23 are not supported by Astro.

You can choose one of the following methods for project development:

- [Bun](https://bun.com/get) - Recommended for local development
- [Node.js](https://nodejs.org/) - Alternative to Bun
- [Docker](https://docs.docker.com/get-started/get-docker) and [Docker Compose](https://docs.docker.com/compose/install) - Create an isolated development environment

### Getting started

1. **Clone the repository and enter the directory:**
   ```shell
   git clone https://github.com/cworld1/astro-theme-pure.git
   cd astro-theme-pure
   ```
2. **Configure the site:**
   - Edit `src/site.config.ts` to customize the site.

#### Option 1: Native environment

1. **Install dependencies:**
   ```shell
   # Install project dependencies
   bun install
   ```
2. **Start the development server:**
   ```shell
   bun dev
   # or
   pnpm dev
   # or
   yarn run dev
   # or
   npm run dev
   ```
   The development server runs at http://localhost:4321 by default.

#### Option 2: Docker isolated environment

Use Docker Compose to run Astro and its dependencies inside a Bun container while keeping your project source files on the host.

1. **Build and start the development container:**
   ```shell
   docker compose --profile dev up --build
   ```
   The first run builds the image and when it starts, mounts the project source into the container and stores `node_modules` in a Docker-managed volume. The development server runs at http://localhost:4321 by default.
2. **Stop and remove the container:**
   ```shell
   docker compose down
   ```

### Creating a new blog article

After setting up either development environment, you can create a new blog article:

```shell
# Create a new post
bun pure new
# or
docker compose --profile new run --rm new
```

## Deployment

### Manual deployment

1. **Build the production site into the `./dist` directory:**
   ```shell
   bun run build
   # or
   docker compose --profile build up --build
   ```
   Once the build is complete, the generated static files will be located in the `./dist` directory. You can deploy this directory to any platform that supports static site hosting.
2. **Preview the production build locally (optional):**
   ```shell
   # preview (build before previewing)
   bun preview
   # or
   docker compose --profile preview up --build
   ```

### Static hosting platforms

You can deploy your blog to any static site hosting platform.

- Refer to the official [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/) for specific deployment methods.
- Depending on the deployment platform you choose, you may need to modify the `astro.config.ts` configuration file in the project.

| Vercel | Netlify |
| :---: | :---: |
| [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcworld1%2Fastro-theme-pure) | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/cworld1/astro-theme-pure) |

## Contributions

To spend more time coding and less time fiddling with whitespace, this project uses code conventions and styles to encourage consistency. Code with a consistent style is easier (and less error-prone!) to review, maintain, and understand.

## Thanks

- [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus)
- [Astro Resume](https://github.com/srleom/astro-theme-resume)
- [Starlight](https://github.com/withastro/starlight)

Other third party references are on [Docs#Contributions](https://astro-pure.js.org/docs/advanced/about). Appreciate for all open source libraries.

## License

This project is licensed under the Apache 2.0 License.

[![Star History Chart](https://star-history.dera.page/svg?repos=cworld1/astro-theme-pure&type=Date)](https://star-history.dera.page/#cworld1/astro-theme-pure&Date)
