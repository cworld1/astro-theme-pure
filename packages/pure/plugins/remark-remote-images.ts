import type { Definition, ImageReference, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

type HProperties = {
  class?: unknown
  className?: unknown
  loading?: unknown
  decoding?: unknown
  fetchpriority?: unknown
  referrerpolicy?: unknown
}

const escapeAttr = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const joinClassName = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string').join(' ')
  return undefined
}

const toRemoteUrl = (value: string): string | undefined => {
  if (!URL.canParse(value)) return undefined
  const url = new URL(value)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined
  return url.toString()
}

const toImgHtml = (
  src: string,
  alt: string | null | undefined,
  title: string | null | undefined,
  props: HProperties
): string => {
  const attrs: string[] = []

  attrs.push(`src="${escapeAttr(src)}"`)
  attrs.push(`alt="${escapeAttr(alt ?? '')}"`)

  if (title) attrs.push(`title="${escapeAttr(title)}"`)

  const className = joinClassName(props.className) ?? joinClassName(props.class)
  if (className) attrs.push(`class="${escapeAttr(className)}"`)

  const loading = typeof props.loading === 'string' ? props.loading : 'lazy'
  const decoding = typeof props.decoding === 'string' ? props.decoding : 'async'
  attrs.push(`loading="${escapeAttr(loading)}"`)
  attrs.push(`decoding="${escapeAttr(decoding)}"`)

  if (typeof props.fetchpriority === 'string')
    attrs.push(`fetchpriority="${escapeAttr(props.fetchpriority)}"`)
  if (typeof props.referrerpolicy === 'string')
    attrs.push(`referrerpolicy="${escapeAttr(props.referrerpolicy)}"`)

  return `<img ${attrs.join(' ')}>`
}

export const remarkRemoteImagesToNativeImg: Plugin<[], Root> =
  () =>
  (tree) => {
    const definitionMap = new Map<string, Definition>()
    visit(tree, 'definition', (node: Definition) => {
      definitionMap.set(node.identifier, node)
    })

    visit(tree, 'image', (node, index, parent) => {
      if (index === undefined || !parent) return
      if (!toRemoteUrl(node.url)) return
      parent.children[index] = {
        type: 'html',
        value: toImgHtml(node.url, node.alt, node.title, (node.data?.hProperties ?? {}) as HProperties)
      }
    })

    visit(tree, 'imageReference', (node: ImageReference, index, parent) => {
      if (index === undefined || !parent) return
      const definition = definitionMap.get(node.identifier)
      if (!definition || !toRemoteUrl(definition.url)) return
      parent.children[index] = {
        type: 'html',
        value: toImgHtml(
          definition.url,
          node.alt,
          definition.title,
          (node.data?.hProperties ?? {}) as HProperties
        )
      }
    })
  }
