import { h } from 'hastscript'
import type { ShikiTransformer } from 'shiki'

function parseMetaString(str = '') {
  return Object.fromEntries(
    str.split(' ').reduce(
      (acc: [string, string | true][], cur) => {
        const matched = cur.match(/(.+)?=("(.+)"|'(.+)')$/)
        if (matched === null) return acc
        const key = matched[1]
        const value = matched[3] || matched[4] || true
        acc.push([key, value])
        return acc
      },
      [] as [string, string | true][]
    )
  )
}

// Nest a div in the outer layer
export const updateStyle = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-update-style',
    pre(node) {
      const container = h('pre', node.children)
      node.children = [container]
      node.tagName = 'div'
    }
  }
}

// Process meta string, like ```ts title="test.ts"
export const processMeta = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-process-meta',
    preprocess() {
      if (!this.options.meta) return
      const rawMeta = this.options.meta?.__raw
      if (!rawMeta) return
      const meta = parseMetaString(rawMeta)
      Object.assign(this.options.meta, meta)
    }
  }
}

// Add a title to the code block
export const addTitle = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-add-title',
    pre(node) {
      const rawMeta = this.options.meta?.__raw
      if (!rawMeta) return
      const meta = parseMetaString(rawMeta)
      // If meta is needed to parse in other transformers
      // if (this.options.meta) {
      //   Object.assign(this.options.meta, meta)
      // }
      if (!meta.title) return

      const div = h(
        'div',
        {
          class: 'title text-sm text-muted-foreground px-3 py-1 rounded-lg border'
        },
        meta.title.toString()
      )
      node.children.unshift(div)
    }
  }
}

// Add a language tag to the code block
export const addLanguage = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-add-language',
    pre(node) {
      const span = h(
        'span',
        { class: 'language ps-1 pe-3 text-sm bg-muted text-muted-foreground' },
        this.options.lang
      )
      node.children.push(span)
    }
  }
}

// Add a copy button to the code block
export const addCopyButton = (timeout?: number): ShikiTransformer => {
  const toggleMs = timeout || 2000
  return {
    name: 'shiki-transformer-copy-button',
    pre(node) {
      const button = h(
        'button',
        {
          class: 'copy text-muted-foreground p-1 box-content border rounded-lg bg-card',
          'aria-label': 'Copy code',
          'data-code': this.source,
          onclick: `
          navigator.clipboard.writeText(this.dataset.code);
          this.classList.add('copied');
          setTimeout(() => this.classList.remove('copied'), ${toggleMs})
        `
        },
        [
          h('div', { class: 'ready' }, [
            h('svg', { class: 'size-5' }, [
              h('use', { href: '/icons/code.svg#mingcute-clipboard-line' })
            ])
          ]),
          h('div', { class: 'success hidden' }, [
            h('svg', { class: 'size-5' }, [
              h('use', { href: '/icons/code.svg#mingcute-file-check-line' })
            ])
          ])
        ]
      )
      node.children.push(button)
    }
  }
}

// Add a copy button to the code block
export const addCollapse = (displayLineCount?: number): ShikiTransformer => {
  const line = displayLineCount || 15
  return {
    name: 'shiki-transformer-add-collapse',
    pre(node) {
      if (this.lines.length <= line) return
      node.properties = {
        ...node.properties,
        class: `${(node.properties?.class as string) || ''} collapsed`
      }
      const collapse = h(
        'button',
        {
          class: 'collapse-toggle bg-card text-muted-foreground rounded-lg m-2',
          'aria-label': 'Toggle collapse code block',
          onclick: "this.parentElement.classList.toggle('collapsed')"
        },
        [
          h('svg', { class: 'size-5' }, [
            h('use', { href: '/icons/code.svg#mingcute-arrow-down-line' })
          ]),
          h('span', { class: 'desc' }, ' code')
        ]
      )
      node.children.push(collapse)
      node.children.push(h('div', { class: 'collapse-fade' }))
    }
  }
}
