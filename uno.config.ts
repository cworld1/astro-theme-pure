import { defineConfig, presetTypography, presetUno } from 'unocss'

const fg = 'hsl(var(--foreground) / var(--un-text-opacity, 1))'
const fgMuted = 'hsl(var(--muted-foreground) / var(--un-text-opacity, 1))'
const bgMuted = 'hsl(var(--muted) / var(--un-bg-opacity, 1))'

const typographyConfig = {
  cssExtend: {
    // Title
    'h2,h3,h4,h5,h6': {
      'scroll-margin-top': '3rem',
      'font-weight': '500',
      color: fg
    },
    'h1>a,h2>a,h3>a,h4>a,h5>a,h6>a': {
      'margin-inline-start': '0.75rem',
      color: fgMuted,
      transition: 'opacity 0.2s ease',
      opacity: '0'
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
    // Blockquote
    blockquote: {
      position: 'relative',
      overflow: 'hidden',
      'border-width': '1px',
      'border-left': 'inherit',
      'border-radius': 'var(--radius)',
      'padding-inline': '1.6rem',
      'box-shadow': '0 5px 0 ' + bgMuted
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
    table: {
      display: 'block',
      width: '100%',
      'overflow-x': 'scroll',
      'font-size': '.875em'
    },
    'table tr': {
      'border-bottom-width': '1px'
    },
    'tbody tr:last-child': {
      'border-bottom-width': '0'
    },
    'thead th': {
      'font-weight': '500',
      color: fg
    },
    'td,th': {
      border: 'inherit',
      'text-align': 'start',
      padding: '0.57em'
    },
    'thead th:first-child,thead th:first-child,tbody td:first-child,tfoot td:first-child': {
      'padding-inline-start': '0'
    },
    // List
    'ol, ul': {
      'padding-left': '1.625em'
    },
    'ol>li, ul>li': {
      'padding-inline-start': '.375em'
    },
    'ul>li::marker': {
      color: fgMuted,
      '--un-text-opacity': '0.35'
    },
    li: {
      'margin-top': '.5em',
      'margin-bottom': '.5em'
    },
    // Others
    img: {
      'border-radius': 'var(--radius)',
      margin: '0 auto'
    },
    hr: {
      '--un-prose-hr': 'hsl(var(--border) / 1)'
    },
    kbd: {
      color: fg,
      'border-color': 'hsl(var(--border) / 1)',
      'box-shadow':
        '0 0 0 1px hsl(var(--primary-foreground) / 1), 0 3px hsl(var(--primary-foreground) / 1)'
    },
    strong: {
      'font-weight': '600',
      color: fg
    },
    a: {
      'font-weight': '500',
      color: fg
    },
    'code:not(pre code)': {
      'white-space': 'pre-wrap!important',
      'word-break': 'break-all!important'
    },
    '.katex-html': {
      overflow: 'auto hidden',
      padding: '3px'
    },
    '.katex-html .base': {
      'margin-block': '0',
      'margin-inline': 'auto'
    },
    '.katex-html .tag': {
      position: 'relative !important',
      display: 'inline-block',
      'padding-inline-start': '0.5rem'
    }
  }
}

const themeColors = {
  border: 'hsl(var(--border) / <alpha-value>)',
  input: 'hsl(var(--input) / <alpha-value>)',
  ring: 'hsl(var(--ring) / <alpha-value>)',
  background: 'hsl(var(--background) / <alpha-value>)',
  foreground: 'hsl(var(--foreground) / <alpha-value>)',
  primary: {
    DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
    foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
    foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
    foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
    foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
    foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
  },
  card: {
    DEFAULT: 'hsl(var(--card) / <alpha-value>)',
    foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
  }
}

export default defineConfig({
  presets: [
    presetUno(), // required
    presetTypography(typographyConfig)
  ],
  rules: [],
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
