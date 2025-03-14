import type { Element, Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that wraps direct table children of #content in a scrollable div
 */
const rehypeWrapContentTables: Plugin<[], Root> = () => {
  return (tree) => {
    // console.log('tree', tree)
    // Find all tables and check their parent
    visit(tree, 'element', (node: Element, index: number | undefined, parent?: Element | Root) => {
      if (
        // Check if this is a table element
        node.tagName === 'table' &&
        // Verify it has a parent
        parent &&
        typeof index === 'number'
      ) {
        // Create wrapper div with appropriate classes
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['overflow-x-auto', 'w-full']
          },
          children: [node] // Place the table inside the wrapper
        }

        // Replace the table with the wrapper (that contains the table)
        parent.children.splice(index, 1, wrapper)
      }
    })
  }
}

export default rehypeWrapContentTables
