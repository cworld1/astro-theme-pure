---
title: 'UnoCSS & Styles'
description: 'Change the appearance of the site & create custom styles'
order: 6
---

## UnoCSS Change Appearance

You can customize the theme default UnoCSS palette by modifying the CSS file at `src/assets/styles/app.css`. For example, if you want to change the default theme color, you can modify the following code:

```css title="src/assets/styles/app.css"
:root {
  /* ... */
  --primary: 200 29% 45%; /* [!code --] */
  --primary: <Your favorite color using raw hsl>; /* [!code ++] */
}
```

And the same way to change the default font family, you can modify the following code:

```css title="src/assets/styles/app.css"
:root {
  /* ... */
  font-family: 'Satoshi'; /* [!code --] */
  src: url('/fonts/Satoshi-Variable.ttf'); /* [!code --] */
  font-family: '<Your favorite font family>'; /* [!code ++] */
  src: url('/fonts/<Your favorite font>.ttf'); /* [!code ++] */
}
```

Make sure to put your custom font file in the `public/fonts` directory.

## UnoCSS Configuration

File: `uno.config.ts`

Get to know more:

- [UnoCSS: Astro Integration](https://unocss.dev/integrations/astro)
- [UnoCSS: Configuring UnoCSS](https://unocss.dev/config)

## `@unocss/preset-typography`

Typography config can be modified in `uno.config.ts`:

```js title="uno.config.ts"
const typographyConfig = {
  // prettier-ignore
  cssExtend: { // [!code highlight:3]
    // ...
  }
}
```

But if you want to customize the typography by UnoCSS, or just change the preset typography theme, you can do it in `src/site.config.ts`:

```ts title="src/site.config.ts"
export const integ: IntegrationUserConfig = {
  // ...
  typography: {
    class: 'prose text-base text-muted-foreground' // [!code highlight]
  }
}
```

Checkout [Typography preset](https://unocss.dev/presets/typography) for more.
