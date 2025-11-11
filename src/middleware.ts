import { defineMiddleware } from 'astro/middleware'
import projectContext from 'virtual:project-context'
import config from 'virtual:config'

const getCookie = (name: string, cookie: string | null) => {
  if (!cookie) return undefined
  const parts = cookie.split(';').map((p) => p.trim())
  for (const p of parts) {
    const i = p.indexOf('=')
    if (i > 0) {
      const k = p.slice(0, i)
      if (k === name) return decodeURIComponent(p.slice(i + 1))
    }
  }
  return undefined
}

export const onRequest = defineMiddleware(async (context, next) => {
  const accept = context.request.headers.get('accept') || ''
  if (!/text\/html/i.test(accept)) return next()
  if (!(config.i18n && config.i18n.browserPreferredLocale)) return next()
  const locales = projectContext?.i18n?.locales || []
  const defaultLocale = projectContext?.i18n?.defaultLocale || 'en'
  const trailing = projectContext?.trailingSlash

  const url = new URL(context.request.url)
  const assetPath = url.pathname
  const isAsset = /^\/(?:_astro|@vite|node_modules|src|packages|public|assets|favicon|fonts|images)/.test(
    assetPath
  )
  if (isAsset) return next()
  const path = url.pathname.replace(/\/+$/, trailing === 'always' ? '/' : '')
  const seg = (path.split('/').filter(Boolean)[0] || '')
  const hasExplicitLocale = locales.includes(seg)
  if (hasExplicitLocale) return next()

  const cookieLocale = config.i18n?.rememberSelectedLocale
    ? getCookie('locale', context.request.headers.get('cookie'))
    : config.i18n?.browserPreferredLocale && config.i18n?.rememberSelectedLocale === false
      ? getCookie('locale', context.request.headers.get('cookie'))
      : undefined
  const pickBase = (v: string) => (v || '').split('-')[0]
  let chosen: string | undefined
  if (cookieLocale && locales.includes(cookieLocale)) {
    chosen = cookieLocale
  } else {
    const header = context.request.headers.get('accept-language') || ''
    const codes = header
      .split(',')
      .map((s) => s.trim().split(';')[0])
      .filter(Boolean)
    const bases = codes.map((c) => pickBase(c))
    chosen = locales.find((l) => bases.includes(pickBase(l)))
  }

  if (chosen && chosen !== defaultLocale) {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/+/g, '/').replace(/\/$/, '/')
    const afterBase = path.startsWith(base) ? path.slice(base.length) : path.slice(1)
    const rest = afterBase.replace(/^\/+/, '')
    let nextPath = base + chosen + (rest ? '/' + rest : '')
    if (trailing === 'always') nextPath = nextPath.endsWith('/') ? nextPath : nextPath + '/'
    if (trailing === 'never' && nextPath !== '/') nextPath = nextPath.replace(/\/$/, '')
    const qs = url.search && url.search !== '?' ? url.search : ''
    const relative = nextPath + qs
    const absolute = new URL(relative, url).toString()
    return Response.redirect(absolute, 302)
  }
  return next()
})