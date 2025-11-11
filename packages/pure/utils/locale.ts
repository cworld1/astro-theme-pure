import projectContext from 'virtual:project-context'
import isAbsoluteUrl from './is-absolute-url'

// Menu types
export type MenuItem = { title: string; link: string }
export type LocaleMenuRecord = Record<string, MenuItem[]>
export type HeaderMenuInput = MenuItem[] | LocaleMenuRecord
export type ResolvedMenu = MenuItem[]

// Global locale state for link building, set once at layout level
let currentLocale: string | undefined
const defaultHrefLocale = projectContext?.i18n?.defaultLocale ?? 'en'

export const initializeRuntimeLocale = (locale?: string) => {
  currentLocale = locale
}

export const getLocale = () => currentLocale ?? defaultHrefLocale

type LocalizeLinkFn = ((path: string) => string) & { set: (locale?: string) => void }

export const localizeLink: LocalizeLinkFn = Object.assign(
  (path: string) => {
    const locale = getLocale()
    const defaultLocale = projectContext?.i18n?.defaultLocale ?? 'en'
    if (!path) return path
    const lower = path.toLowerCase()
    if (
      isAbsoluteUrl(path) ||
      lower.startsWith('#') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:') ||
      lower.startsWith('javascript:')
    ) {
      return path
    }
    let url = path
    if (path.startsWith('/')) {
      url = locale === defaultLocale ? path : `/${locale}${path}`.replace(/\/+/, '/')
    }
    if (projectContext?.trailingSlash === 'never') {
      url = url.replace(/\/(?=[?#]|$)/, '')
      if (url === '') url = '/'
    }
    return url
  },
  { set: initializeRuntimeLocale }
)


/**
 * Normalize a blog entry id to be used in routes.
 * - Strips leading `blog/` or `localized/<lang>/blog/` segments
 * - Removes trailing `/index` for cleaner URLs
 */
export const normalizeLocaleBlogId = (id: string) =>
  id
    .replace(/^localized\/[^/]+\/blog\//, '')
    .replace(/^blog\//, '')
    .replace(/\/index$/, '')

// Locale helpers
export const getBaseLocale = (currentLocale?: string, urlPathname?: string) => {
  const firstSeg = (urlPathname || '').split('/').filter(Boolean)[0]
  const raw = currentLocale || firstSeg || defaultHrefLocale
  return raw.split('-')[0]
}

// Resolve a locale-aware menu: accepts array or record of arrays
export const resolveMenu = (
  rawMenu: HeaderMenuInput,
  currentLocale?: string,
  urlPathname?: string
): ResolvedMenu => {
  const locale = getBaseLocale(currentLocale, urlPathname)
  if (Array.isArray(rawMenu)) return rawMenu
  return (
    (rawMenu as LocaleMenuRecord)?.[locale] ||
    (rawMenu as LocaleMenuRecord)?.[currentLocale as keyof LocaleMenuRecord] ||
    (rawMenu as LocaleMenuRecord)?.en ||
    (Object.values((rawMenu as LocaleMenuRecord) || {})[0] as MenuItem[] | undefined) ||
    []
  )
}

// i18n translations
type Messages = Record<string, unknown>
type NamespacedLocales = Record<string, Record<string, Messages>>

// Eagerly load all locale files: ../i18n/locales/<locale>/<namespace>.ts
const eagerLocaleModules = import.meta.glob('../i18n/locales/*/*.ts', { eager: true }) as Record<
  string,
  { default?: Messages } | Messages
>

// Build a { locale: { namespace: messages } } lookup
const LOCALes: NamespacedLocales = {}
for (const [path, mod] of Object.entries(eagerLocaleModules)) {
  const m = path.match(/\/locales\/(.*?)\/(.*?)\.ts$/)
  if (!m) continue
  const [, locale, ns] = m
  const messages = (mod as any).default ?? mod
  LOCALes[locale] ??= {}
  LOCALes[locale][ns] = messages as Messages
}

// Helper: access nested key via dot path
const getByPath = (obj: Record<string, any>, key: string) => {
  return key.split('.').reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj)
}

// Helper: simple template interpolation using {name}
const interpolate = (template: string, params?: Record<string, any>) => {
  if (!params) return template
  return template.replace(/\{(.*?)\}/g, (_, name) => {
    const v = params[name]
    return v == null ? `{${name}}` : String(v)
  })
}

/**
 * Create a translator for a given namespace and locale.
 * Falls back to base locale and then to English.
 */
export function useTranslations(namespace: string | string[] = 'common', locale?: string) {
  const rawLocale = locale ?? getLocale()
  const base = getBaseLocale(rawLocale)

  const mergeObjects = (target: Record<string, any>, source: Record<string, any>) => {
    const result: Record<string, any> = { ...target }
    for (const [k, v] of Object.entries(source)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const tv = result[k]
        result[k] = mergeObjects(tv && typeof tv === 'object' ? tv : {}, v)
      } else {
        result[k] = v
      }
    }
    return result
  }

  const namespaces = Array.isArray(namespace) ? namespace : [namespace]
  const merged = namespaces
    .slice()
    .reverse()
    .reduce((acc, ns) => {
      const src =
        LOCALes[rawLocale]?.[ns] || LOCALes[base]?.[ns] || LOCALes['en']?.[ns] || {}
      return mergeObjects(acc as Record<string, any>, src as Record<string, any>)
    }, {} as Messages)

  const messages = merged

  const t = (key: string, params?: Record<string, any>): string => {
    const value = typeof key === 'string' ? getByPath(messages as Record<string, any>, key) : undefined
    if (typeof value === 'string') return interpolate(value, params)
    if (value != null) return String(value)
    return key
  }

  return { t, messages, locale: rawLocale, namespace }
}

export async function getStaticPaths() {
  const configured = projectContext?.i18n?.locales || []
  const fallback = projectContext?.i18n?.defaultLocale || 'en'
  try {
    const mod = await import('astro:i18n') as any
    const urls = (mod?.getRelativeLocaleUrlList?.() || [])
      .map((u: string) => u.replace(/^\//, '').replace(/\/$/, ''))
      .filter(Boolean)
    const langs = Array.from(new Set((configured.length ? configured : [fallback]).concat(urls)))
    return langs.map((lang) => ({ params: { lang } }))
  } catch {
    const langs = configured.length ? configured : [fallback]
    return langs.map((lang) => ({ params: { lang } }))
  }
}
