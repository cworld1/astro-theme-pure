import projectContext from 'virtual:project-context'
import config from 'virtual:config'

const pickBase = (v?: string) => (v || '').split('-')[0]

const ensureTrailing = (p: string, mode: 'always' | 'never' | 'ignore' | undefined) => {
  if (mode === 'always') return p.endsWith('/') ? p : p + '/'
  if (mode === 'never') return p === '/' ? p : p.replace(/\/$/, '')
  return p
}

const buildLocalePath = (locale: string, path: string) => {
  const trailing = projectContext?.trailingSlash
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+/g, '/').replace(/\/$/, '/')
  const cleanPath = path.replace(/\/+/g, '/').replace(/^\/+/, '/')
  const afterBase = cleanPath.startsWith(base) ? cleanPath.slice(base.length) : cleanPath.slice(1)
  const rest = afterBase.replace(/^\/+/, '')
  let next = base + locale + (rest ? '/' + rest : '')
  next = ensureTrailing(next, trailing)
  return next
}

export function redirectToPreferredLocale() {
  try {
    if (!(config.i18n && config.i18n.browserPreferredLocale)) return
    const effectiveRemember = !!(
      config.i18n?.rememberSelectedLocale ||
      (config.i18n?.browserPreferredLocale && config.i18n?.rememberSelectedLocale === false)
    )
    const locales = projectContext?.i18n?.locales || []
    const defaultLocale = projectContext?.i18n?.defaultLocale || 'en'
    const path = location.pathname
    const seg = (path.split('/').filter(Boolean)[0] || '')
    const hasExplicitLocale = (locales || []).includes(seg)
    if (hasExplicitLocale) return
    let saved = ''
    try {
      if (effectiveRemember) {
        saved = localStorage.getItem('locale') || ''
      }
    } catch (_) {}
    if (!saved && effectiveRemember) {
      try {
        const cookie = document.cookie || ''
        const match = cookie.split(';').map((p) => p.trim()).find((p) => p.startsWith('locale='))
        if (match) saved = decodeURIComponent(match.slice('locale='.length))
      } catch (_) {}
    }
    const savedOk = saved && (locales || []).includes(saved)
    const prefer = savedOk
      ? saved
      : pickBase(navigator.language || (navigator.languages && navigator.languages[0]) || '')
    const match = (locales || []).find((l) => pickBase(l) === pickBase(prefer))
    if (match && match !== defaultLocale) {
      const qs = location.search.length > 1 ? location.search : ''
      const hs = location.hash.length > 0 ? location.hash : ''
      const to = buildLocalePath(match, path) + qs + hs
      location.replace(to)
    }
  } catch (_) {}
}

export function initLocaleRedirect() {
  const fmt = projectContext?.build?.format
  if (fmt === 'server') return
  redirectToPreferredLocale()
}