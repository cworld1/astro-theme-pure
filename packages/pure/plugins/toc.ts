import type { MarkdownHeading } from 'astro'

export interface TocItem extends MarkdownHeading {
  subheadings: TocItem[]
}

export function generateToc(headings: readonly MarkdownHeading[]): TocItem[] {
  const root: TocItem = { depth: 0, slug: 'root', text: 'Root', subheadings: [] }
  const stack: TocItem[] = [root]

  headings.forEach((h) => {
    const heading: TocItem = { ...h, subheadings: [] }
    // Find the correct parent in the stack.
    // The parent is the last item on the stack with a depth less than the current heading.
    while (stack[stack.length - 1].depth >= heading.depth) {
      stack.pop()
    }
    // Add the new heading as a child of the correct parent.
    stack[stack.length - 1].subheadings.push(heading)
    // Push the new heading onto the stack, making it the current deepest heading.
    stack.push(heading)
  })
  return root.subheadings
}
