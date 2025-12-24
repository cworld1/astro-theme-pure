/// <reference types="astro/astro-jsx" />

import { type DocumentNode, type Node, parse, render } from 'ultrahtml'

export type SVGAttributes = Omit<
  astroHTML.JSX.SVGAttributes,
  'client:list' | 'set:text' | 'set:html' | 'is:raw'
>

const EMPTY_STRING_ERR = '`svgSource` must have content'
const MUST_START_WITH_SVG = '`svgSource` must begin with `<svg`'

export async function overrideSvgAttributes(
  svgSource: string,
  attributeOverrides: SVGAttributes = {}
): Promise<string> {
  if (!svgSource) {
    throw new Error(EMPTY_STRING_ERR)
  }
  if (!svgSource.trimStart().toLowerCase().startsWith('<svg')) {
    throw new Error(MUST_START_WITH_SVG)
  }

  const doc = parse(svgSource) as DocumentNode

  const firstSVGNode = doc.children.find(({ type, name }: Node) => type === 1 && /svg/i.test(name))

  const mergedAttributes = Object.fromEntries(
    Object.entries({
      ...firstSVGNode.attributes,
      ...attributeOverrides
    }).filter(([, value]) => !!value)
  )

  const updatedSVG = {
    ...firstSVGNode,
    attributes: mergedAttributes
  }

  return render(updatedSVG)
}
