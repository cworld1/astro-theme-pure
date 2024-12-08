import type { Node, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const remarkAddZoomable: Plugin<[{ className?: string }], Root> = function ({
  className = 'zoomable'
}) {
  return function (tree) {
    visit(tree, 'image', (node: Node) => {
      node.data = { hProperties: { class: className } }
    })
  }
}
