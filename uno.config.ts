import type { TypographyOptions } from '@unocss/preset-typography'
import { defineConfig, presetMini, presetTypography, type Rule } from 'unocss'

import { integ } from './src/site.config.ts'

const typographyCustom = integ.typography || {}

const fg = 'hsl(var(--foreground) / var(--un-text-opacity, 1))'
const fgMuted = 'hsl(var(--muted-foreground) / var(--un-text-opacity, 1))'
const bgMuted = 'hsl(var(--muted) / var(--un-bg-opacity, 1))'
const border = 'var(--un-default-border-color)'
const radius = 'var(--radius)'

const typographyConfig: TypographyOptions = {
  colorScheme: {
    body: fgMuted,
    headings: fg,
    // "lead": [600, 400],
    links: fg,
    bold: fg,
    counters: 'hsl(var(--muted-foreground) / 0.6)',
    bullets: 'hsl(var(--muted-foreground) / 0.4)',
    hr: 'hsl(var(--muted-foreground) / 0.4)',
    quotes: fgMuted,
    // 'quote-borders': [200, 700],
    // captions: [500, 400],
    kbd: fg,
    // 'kbd-shadows': [900, "white"],
    code: fg,
    'pre-code': fgMuted,
    // 'pre-bg': [800, 'rgb(0 0 0 / 50%)'],
    'th-borders': border,
    'td-borders': border
  },
  cssExtend: {
    // Title
    'h2,h3,h4,h5,h6': {
      'scroll-margin-top': '4rem'
    },
    'h1>a,h2>a,h3>a,h4>a,h5>a,h6>a': {
      'margin-inline-start': '0.75rem',
      color: fgMuted,
      transition: 'opacity 0.2s ease',
      opacity: '0',
      'user-select': 'none'
    },
    'h1>a:focus,h2>a:focus,h3>a:focus,h4>a:focus,h5>a:focus,h6>a:focus': {
      opacity: 1
    },
    'h1:hover>a,h2:hover>a,h3:hover>a,h4:hover>a,h5:hover>a,h6:hover>a': {
      opacity: 1
    },
    'h1:target>a,h2:target>a,h3:target>a,h4:target>a,h5:target>a,h6:target>a': {
      opacity: 1
    },
    // Links
    a: {
      'word-wrap': 'break-word',
      'word-break': 'break-word',
      'overflow-wrap': 'anywhere'
    },
    // Inline code
    ':not(pre) > code': {
      'white-space': 'pre-wrap',
      'word-break': 'break-all'
    },
    ...(typographyCustom.inlineCodeBlockStyle === 'modern' && {
      ':not(pre) > code': {
        padding: '0.3em 0.5em',
        border: `1px solid ${border}`,
        'border-radius': radius,
        'background-color': bgMuted
      },
      ':not(pre)>code::before': {
        content: 'none'
      },
      ':not(pre)>code::after': {
        content: 'none'
      }
    }),
    // Blockquote
    blockquote: {
      position: 'relative',
      overflow: 'hidden',
      'border-width': '1px',
      'border-inline-start-color': 'inherit',
      'border-radius': `calc(1.5 * ${radius})`,
      'padding-inline': '1.6rem',
      'box-shadow': `0 5px 0 ${bgMuted}`,
      ...(typographyCustom.blockquoteStyle === 'normal' && { 'font-style': 'normal' })
    },
    'blockquote::after': {
      color: fgMuted,
      position: 'absolute',
      content: '"”"',
      top: '2.6rem',
      right: '-1.4rem',
      'font-size': '10rem',
      'font-family':
        '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
      transform: 'rotate(-15deg)',
      opacity: '0.1'
    },
    // Table
    table: { display: 'block', 'font-size': '.875em' },
    'table tr': { 'border-bottom-width': '1px' },
    'tbody tr:last-child': { 'border-bottom-width': '0' },
    'thead th': { 'font-weight': '500', color: fg },
    'td, th': { border: 'inherit', 'text-align': 'start', padding: '0.57em' },
    'thead th:first-child,thead th:first-child,tbody td:first-child,tfoot td:first-child': {
      'padding-inline-start': '0'
    },
    // List
    'ol, ul': { 'padding-inline-start': '1.625em' },
    'ol>li, ul>li': { 'padding-inline-start': '.375em' },
    li: { 'margin-top': '.5em', 'margin-bottom': '.5em' },
    // Others
    img: { 'border-radius': radius, margin: '0 auto' },
    kbd: {
      'border-color': border,
      'box-shadow': '0 0 0 1px hsl(var(--card) / 1), 0 3px hsl(var(--card) / 1)'
    },
    'sup>a': { 'scroll-margin-top': '4rem' }
  }
}

const themeColors = {
  // Primary
  primary: 'hsl(var(--primary) / <alpha-value>)',
  // Foreground & background
  foreground: 'hsl(var(--foreground) / <alpha-value>)',
  background: 'hsl(var(--background) / <alpha-value>)',
  muted: {
    DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
  },
  card: 'hsl(var(--card) / <alpha-value>)',

  // Basic
  border: 'hsl(var(--border) / <alpha-value>)',
  input: 'hsl(var(--input) / <alpha-value>)',
  ring: 'hsl(var(--ring) / <alpha-value>)'
}

const rules: Rule<object>[] = [
  // Fix unocss presetMini
  [
    'sr-only',
    {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      'white-space': 'nowrap',
      'border-width': '0'
    }
  ],
  ['object-cover', { 'object-fit': 'cover' }],
  ['bg-cover', { 'background-size': 'cover' }],
  [
    /^line-clamp-(\d+)$/,
    ([, d]) => ({
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': d
    })
  ]
]

export default defineConfig({
  presets: [
    presetMini(), // required
    presetTypography(typographyConfig)
  ],
  rules,
  theme: {
    colors: themeColors
  },
  // https://unocss.dev/guide/extracting#limitations
  safelist: [
    // TOC
    'rounded-t-2xl',
    'rounded-b-2xl',
    // Typography
    'text-base',
    'prose'
  ]
})
