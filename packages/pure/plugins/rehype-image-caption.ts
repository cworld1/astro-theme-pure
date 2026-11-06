// https://github.com/Saramanda9988/blog-pure/blob/luna-pure/packages/pure/plugins/rehype-image-caption.ts
import type { Element, Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * Rehype plugin to wrap images with alt text in a figure element with figcaption
 */
const rehypeImageCaption: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Only process <img> elements that have alt text
      if (
        node.tagName === 'img' &&
        typeof node.properties?.alt === 'string' &&
        node.properties.alt.trim() !== '' &&
        parent &&
        typeof index === 'number'
      ) {
        const altText = node.properties.alt as string
        // Create figcaption element
        const figcaption: Element = {
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: altText }]
        }
        // Create figure element wrapping the image
        const figure: Element = {
          type: 'element',
          tagName: 'figure',
          properties: { style: 'text-align:center' },
          children: [node, figcaption]
        }
        // Replace the img node with the figure node
        parent.children[index] = figure
      }
    })
  }
}

export default rehypeImageCaption
