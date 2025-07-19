// https://github.com/rehypejs/rehype-external-links

import type { Element, ElementContent, Root } from 'hast'
import { visit } from 'unist-util-visit'

import isAbsoluteUrl from '../utils/is-absolute-url'

export interface ExternalLinkOptions {
  content?: ElementContent | ElementContent[]
  contentProperties?: Record<string, unknown>
  protocols?: string[]
}

const defaultProtocols = ['http', 'https']

/**
 * Automatically add `rel` (and `target`?) to external links.
 *
 * ###### Notes
 *
 * You should [likely not configure `target`][css-tricks].
 *
 * You should at least set `rel` to `['nofollow']`.
 * When using a `target`, add `noopener` and `noreferrer` to avoid exploitation
 * of the `window.opener` API.
 *
 * When using a `target`, you should set `content` to adhere to accessibility
 * guidelines by giving users advanced warning when opening a new window.
 *
 * [css-tricks]: https://css-tricks.com/use-target_blank/
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeExternalLinks(options: ExternalLinkOptions = {}) {
  const { content, contentProperties = {}, protocols = defaultProtocols } = options

  return function transformer(tree: Root): void {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
        const href = node.properties.href
        const protocol = href.startsWith('//')
          ? 'http' // treat protocol-relative as http
          : href.slice(0, href.indexOf(':'))

        if (href.startsWith('//') || (isAbsoluteUrl(href) && protocols.includes(protocol))) {
          node.properties = {
            ...node.properties,
            rel: 'nofollow noopener noreferrer',
            target: '_blank'
          }

          if (content) {
            const spanNode: Element = {
              type: 'element',
              tagName: 'span',
              properties: {
                ...(contentProperties as Record<
                  string,
                  string | number | boolean | (string | number)[] | null | undefined
                >)
              },
              children: Array.isArray(content) ? content : [content]
            }

            node.children.push(spanNode)
          }
        }
      }
    })
  }
}
