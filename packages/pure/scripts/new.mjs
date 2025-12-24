/**
 * Create a new post in the content directory
 *
 * Usage: astro-pure new [options] <post-title>
 *
 * Options:
 *   -l, --lang <en|zh>   Set the language (default: en)
 *   -d, --draft          Create a draft post (default: false)
 *   -m, --mdx            Use MDX format (default: false)
 *   -f, --folder         Create the post in a folder (default: false)
 *   -h, --help           Show this help message
 *
 * Example:
 *   astro-pure new "Hello World"
 *   astro-pure new -l zh "你好，世界"
 */

import fs from 'node:fs'
import path from 'node:path'

import minimist from './libs/minimist.cjs'
import slugify from './libs/slugify.cjs'

function getDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Month is 0-based
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/** get blog title slug */
function getPostSlug(postTitle) {
  let slug = slugify(postTitle).toLocaleLowerCase()
  if (slug === '') {
    slug = 'untitled'
  }
  return slug
}

const HELP_INFO = `Usage: astro-pure new [options] <post-title>

Options:
  -l, --lang           Set the language (default: null)
  -d, --draft          Create a draft post (default: false)
  -m, --mdx            Use MDX format (default: false)
  -f, --folder         Create the post in a folder (default: false)
  -h, --help           Show this help message

Example:
  astro-pure new "Hello World"
  astro-pure new -l zh "你好，世界"
`
const TARGET_DIR = 'src/content/blog/'

export default function main(args) {
  const parsedArgs = minimist(args, {
    string: ['lang'],
    boolean: ['draft', 'mdx', 'help', 'folder'],
    default: {
      lang: null,
      draft: false,
      mdx: false,
      folder: false
    },
    alias: {
      l: 'lang',
      d: 'draft',
      m: 'mdx',
      h: 'help',
      f: 'folder'
    }
  })

  if (parsedArgs.help) {
    console.log(HELP_INFO)
    process.exit(0)
  }

  let postTitle = parsedArgs._.join(' ') // join the rest of the arguments
  if (!postTitle || postTitle.trim() === '') {
    postTitle = 'Untitled'
  }
  console.log('Creating new post:', postTitle)

  const fileExtension = parsedArgs.mdx ? '.mdx' : '.md'
  const fileName = getPostSlug(postTitle) + fileExtension

  let fullPath
  if (parsedArgs.folder) {
    const folderName = getPostSlug(postTitle)
    const folderPath = path.join(TARGET_DIR, folderName)
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }
    const fileName = `index${fileExtension}`
    fullPath = path.join(folderPath, fileName)
  } else {
    fullPath = path.join(TARGET_DIR, fileName)
  }

  console.log('Full path:', fullPath)

  if (fs.existsSync(fullPath)) {
    console.error(`ERROR: File ${fullPath} already exists`)
    process.exit(1)
  }

  let content = `---
title: ${postTitle}
description: 'Write your description here.'
publishDate: ${getDate()}
`
  content += parsedArgs.draft ? 'draft: true\n' : ''
  content += parsedArgs.lang ? `lang: ${parsedArgs.lang}\n` : ''
  content += `tags:
  - Example
  - Technology
---

Write your content here.
`

  fs.writeFileSync(fullPath, content)
  console.log(`Post "${postTitle}" created at ${fullPath}`)
}
