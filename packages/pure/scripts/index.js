#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import checkFunc from './check.mjs'
import minimist from './libs/minimist.cjs'
import newFunc from './new.mjs'

const args = minimist(process.argv.slice(2))

switch (args._[0]) {
  case 'check':
    await checkFunc()
    break
  case 'new': {
    const newArgs = process.argv.slice(3)
    newFunc(newArgs)
    break
  }
  case 'info': {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
    console.log()
    console.log('\x1b[46m%s\x1b[0m', ' Astro Theme Pure ')
    console.log('\nInformation:')
    console.log(`- Package:\t${packageJson.version}`)
    console.log(`- Node.js:\t${process.version}`)
    console.log(`- Platform:\t${process.platform}`)
    break
  }
  case 'help': {
    console.log('Usage:')
    console.log('  check - Check envirionment and run corresponding adaption code')
    console.log('  new [args] - Create new post on blog collection')
    console.log('  info - Show this info message')
    console.log('  help - Show this help message')
    break
  }
  default: {
    console.log('Unknown command. Use "help" to see the available commands.')
    break
  }
}
