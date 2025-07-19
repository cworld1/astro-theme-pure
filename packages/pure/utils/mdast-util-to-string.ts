type Options = {
  includeImageAlt?: boolean
  includeHtml?: boolean
}

/**
 * Get the text content of a node or list of nodes.
 *
 * Prefers the node’s plain-text fields, otherwise serializes its children,
 * and if the given value is an array, serialize the nodes in it.
 *
 * @param {unknown} [value]
 *   Thing to serialize, typically `Node`.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized `value`.
 */
export default function toString(value: unknown, options?: Options): string {
  const { includeImageAlt = true, includeHtml = true } = options || {}
  return serialize(value, includeImageAlt, includeHtml)
}

function serialize(value: unknown, includeImageAlt: boolean, includeHtml: boolean): string {
  if (isNode(value)) {
    if ('value' in value) {
      return value.type === 'html' && !includeHtml ? '' : (value.value as string)
    }
    if (includeImageAlt && 'alt' in value && value.alt) {
      return value.alt as string
    }
    if ('children' in value) {
      return serializeAll(value.children as unknown[], includeImageAlt, includeHtml)
    }
  }

  if (Array.isArray(value)) {
    return serializeAll(value, includeImageAlt, includeHtml)
  }
  return ''
}

function serializeAll(values: unknown[], includeImageAlt: boolean, includeHtml: boolean): string {
  return values.map((value) => serialize(value, includeImageAlt, includeHtml)).join('')
}

function isNode(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object')
}
