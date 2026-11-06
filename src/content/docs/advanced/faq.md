---
title: 'FAQs'
description: 'Frequently asked questions'
order: 4
---

## Path

### Blog specific path

Routing blogs format like `/blog/:year/:id`

See [4.0.2-beta如何使文章链接中包含年份](https://github.com/cworld1/astro-theme-pure/discussions/37#discussioncomment-11905851).

## Content

### Support web images for `heroImage`

It should be used with `inferSize: true` to get the image size. Example:

```yaml
heroImage:
  { src: 'https://img.tukuppt.com/ad_preview/00/15/09/5e715a320b68e.jpg!/fw/980', inferSize: true }
```

## Build

### Vite Block Request

```log
Blocked request. This host ("xxx")is not allowed.
To allow this host, add "xxx" to `preview.allowedHosts` in vite.config.js.
```

See [option server.allowedHosts doesn't take into account "true"](https://github.com/vitejs/vite/issues/19242)

### Problem with `BUN_LINK_PKG`

See [BUN_LINK_PKG 环境变量无法设置成功](https://github.com/cworld1/astro-theme-pure/issues/51)

### Build No "Exports" Main Defined

```log
07:39:23 [ERROR] [@astrojs/vercel] An unhandled error occurred while running the "astro:build:done" hook
No "exports" main defined in /vercel/path0/node_modules/estree-walker/package.json
  Stack trace:
    ...
```

Try redeploy your project without existing build cache.

Detail: [oven-sh/bun/issues: error No "exports" main defined in /vercel/path0/node_modules/estree-walker/package.json](https://github.com/oven-sh/bun/issues/7241)
