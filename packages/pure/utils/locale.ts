// Menu types
export type MenuItem = { title: string; link: string }
export type LocaleMenuRecord = Record<string, MenuItem[]>
export type HeaderMenuInput = MenuItem[] | LocaleMenuRecord
export type ResolvedMenu = MenuItem[]

const defaultHrefLocale = 'en'

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

// Eagerly load all locale files: ../i18n/<locale>/<namespace>.json
const eagerLocaleModules = import.meta.glob('../i18n/*/*.json', { eager: true }) as Record<
  string,
  { default?: Messages } | Messages
>

// Build a { locale: { namespace: messages } } lookup
const LOCALes: NamespacedLocales = {}
for (const [path, mod] of Object.entries(eagerLocaleModules)) {
  const m = path.match(/\/i18n\/(.*?)\/(.*?)\.json$/)
  if (!m) continue
  const [, locale, ns] = m
  const messages = (mod as any).default ?? mod
  LOCALes[locale] ??= {}
  LOCALes[locale][ns] = messages as Messages
}

const deepMerge = (a: Record<string, any>, b: Record<string, any>) => {
  const result: Record<string, any> = { ...a }
  for (const [k, v] of Object.entries(b)) {
    const av = result[k]
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      result[k] = deepMerge(av && typeof av === 'object' ? av : {}, v)
    } else {
      result[k] = v
    }
  }
  return result
}

export function mergeContentLocale(locale: string, ns: string, record: Record<string, any>) {
  if (!locale || !ns || !record || typeof record !== 'object') return
  LOCALes[locale] ??= {}
  const base = (LOCALes[locale][ns] || {}) as Record<string, any>
  LOCALes[locale][ns] = deepMerge(base, record)
}

// Helper: access nested key via dot path
const getByPath = (obj: Record<string, any>, key: string) => {
  return key
    .split('.')
    .reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj)
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
  const rawLocale = locale ?? defaultHrefLocale
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
      const src = LOCALes[rawLocale]?.[ns] || LOCALes[base]?.[ns] || LOCALes['en']?.[ns] || {}
      return mergeObjects(acc as Record<string, any>, src as Record<string, any>)
    }, {} as Messages)

  const messages = merged

  const t = (key: string, params?: Record<string, any>): string => {
    const value =
      typeof key === 'string' ? getByPath(messages as Record<string, any>, key) : undefined
    if (typeof value === 'string') return interpolate(value, params)
    if (value != null) return String(value)
    return key
  }

  return { t, messages, locale: rawLocale, namespace }
}

export function toLocaleCapitalCase(str: string, locale: string = 'en') {
  return str
    .split(/\s+/) // split on any whitespace
    .map((w) => (w ? w[0].toLocaleUpperCase(locale) + w.slice(1) : w))
    .join(' ')
}
