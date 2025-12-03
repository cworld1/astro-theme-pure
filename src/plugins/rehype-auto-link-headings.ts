import type { Element, ElementContent, Root } from 'hast'
import { visit } from 'unist-util-visit'

const headingRank = (tag: string) => /^h[1-6]$/.test(tag)

// Add # link to headings
export default function rehypeAutolinkHeadings({
  properties = { ariaHidden: 'true', tabIndex: -1 },
  behavior = 'prepend',
  content = { type: 'text', value: '#' } as ElementContent
} = {}) {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (headingRank(node.tagName) && node.properties?.id) {
        const link: Element = {
          type: 'element',
          tagName: 'a',
          properties: { ...properties, href: `#${node.properties.id}` },
          // children: Array.isArray(content) ? content : [content]
          children: Array.isArray(content)
            ? content
            : typeof content === 'object' && content.type
              ? [content]
              : []
        }

        if (!['wrap', 'prepend', 'append'].includes(behavior)) {
          throw new Error(`Invalid behavior: ${behavior}`)
        }

        node.children = node.children || []
        if (behavior === 'wrap') {
          node.children = [link]
        } else if (behavior === 'prepend') {
          node.children.unshift(link)
        } else if (behavior === 'append') {
          node.children.push(link)
        }
      }
    })
  }
}
