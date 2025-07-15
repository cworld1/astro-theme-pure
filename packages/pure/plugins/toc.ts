// Define MarkdownHeading type, compatible with Astro
interface MarkdownHeading {
    depth: number
    slug: string
    text: string
}

export interface TocItem extends MarkdownHeading {
    subheadings: TocItem[]
}

function diveChildren(item: TocItem, depth: number): TocItem[] {
    if (depth === 1 || !item.subheadings.length) {
        return item.subheadings
    } else {
        // e.g., 2
        return diveChildren(item.subheadings[item.subheadings.length - 1] as TocItem, depth - 1)
    }
}

export function generateToc(headings: readonly MarkdownHeading[]) {
    // Safe filtering and validation of headings data
    const safeHeadings = (headings || []).filter((h) => {
        return (
            h &&
            typeof h === 'object' &&
            typeof h.depth === 'number' &&
            typeof h.text === 'string' &&
            h.depth > 0 &&
            h.depth <= 6
        )
    })

    // this ignores/filters out h1 element(s)
    const bodyHeadings = [...safeHeadings.filter(({ depth }) => depth > 1)]

    // Ensure proper heading hierarchy structure
    const validHeadings: MarkdownHeading[] = []
    let hasH2 = false

    for (const heading of bodyHeadings) {
        if (heading.depth === 2) {
            hasH2 = true
            validHeadings.push(heading)
        } else if (heading.depth > 2 && hasH2) {
            // Only add deeper level headings when there's a parent h2
            validHeadings.push(heading)
        }
        // Silently skip deep level headings without parent h2 to avoid console warnings
    }

    const toc: TocItem[] = []

    validHeadings.forEach((h) => {
        const heading: TocItem = { ...h, subheadings: [] }

        // add h2 elements into the top level
        if (h.depth === 2) {
            toc.push(heading)
        } else {
            const lastItemInToc = toc[toc.length - 1]
            if (!lastItemInToc) {
                // If there's no parent h2, skip this heading
                return
            }

            if (h.depth < (lastItemInToc as MarkdownHeading).depth) {
                // Silently skip orphan headings to avoid throwing errors
                return
            }

            // higher depth
            // push into children, or children's children
            const gap = h.depth - (lastItemInToc as MarkdownHeading).depth
            const target = diveChildren(lastItemInToc, gap)
            target.push(heading)
        }
    })
    return toc
}
