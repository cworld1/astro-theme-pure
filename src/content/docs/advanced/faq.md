---
title: 'FAQs'
description: 'Frequently asked questions'
order: 4
---

## Routes

### Blog specific route

Routing blogs format like `/blog/:year/:id`

See [4.0.2-beta如何使文章链接中包含年份](https://github.com/cworld1/astro-theme-pure/discussions/37#discussioncomment-11905851).

## Content

### Support web images for `heroImage`

It should be used with `inferSize: true` to get the image size. Example:

```yaml
heroImage:
  { src: 'https://img.tukuppt.com/ad_preview/00/15/09/5e715a320b68e.jpg!/fw/980', inferSize: true }
```

## Vite

### Vite Block Request

```log
Blocked request. This host ("xxx")is not allowed.
To allow this host, add "xxx" to `preview.allowedHosts` in vite.config.js.
```

See [option server.allowedHosts doesn't take into account "true"](https://github.com/vitejs/vite/issues/19242)

## Packages

### Problem with `BUN_LINK_PKG`

See [BUN_LINK_PKG 环境变量无法设置成功](https://github.com/cworld1/astro-theme-pure/issues/51)
