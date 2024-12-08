import { spawn } from 'node:child_process'
import { dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AstroIntegration } from 'astro'

export function pagefindConfig(): AstroIntegration {
  return {
    name: 'pagefind',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const targetDir = fileURLToPath(dir)
        const cwd = dirname(fileURLToPath(import.meta.url))
        const relativeDir = relative(cwd, targetDir)

        return new Promise<void>((resolve) => {
          spawn('npx', ['-y', 'pagefind', '--site', relativeDir], {
            stdio: 'inherit',
            shell: true,
            cwd
          }).on('close', () => resolve())
        })
      }
    }
  }
}
