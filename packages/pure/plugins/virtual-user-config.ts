import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AstroConfig, ViteUserConfig } from 'astro'

import type { UserConfig } from '../types/user-config'

const collectionNames = ['docs', 'blog'] as const
export type DefaultCollection = (typeof collectionNames)[number]
export function resolveCollectionPath(collection: DefaultCollection, srcDir: URL) {
  return resolve(fileURLToPath(srcDir), `content/${collection}`)
}

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
  return `\0${id}`
}

/** Vite plugin that exposes Starlight user config and project context via virtual modules. */
export function vitePluginUserConfig(
  opts: UserConfig,
  {
    build,
    legacy,
    root,
    srcDir,
    trailingSlash
  }: Pick<AstroConfig, 'root' | 'srcDir' | 'trailingSlash'> & {
    build: Pick<AstroConfig['build'], 'format'>
    legacy: Pick<AstroConfig['legacy'], 'collections'>
  }
): NonNullable<ViteUserConfig['plugins']>[number] {
  /**
   * Resolves module IDs to a usable format:
   * - Relative paths (e.g. `'./module.js'`) are resolved against `base` and formatted as an absolute path.
   * - Package identifiers (e.g. `'module'`) are returned unchanged.
   *
   * By default, `base` is the project root directory.
   */
  const resolveId = (id: string, base = root) =>
    JSON.stringify(id.startsWith('.') ? resolve(fileURLToPath(base), id) : id)

  /**
   * Resolves a path to a Starlight file relative to this file.
   * @example
   * resolveLocalPath('../utils/git.ts');
   * // => '"/users/houston/docs/node_modules/@astrojs/starlight/utils/git.ts"'
   */
  let collectionConfigImportPath = resolve(
    fileURLToPath(srcDir),
    legacy.collections ? './content/config.ts' : './content.config.ts'
  )

  // If not using legacy collections and the config doesn't exist, fallback to the legacy location.
  // We need to test this ahead of time as we cannot `try/catch` a failing import in the virtual
  // module as this would fail at build time when Rollup tries to resolve a non-existent path.
  if (!legacy.collections && !existsSync(collectionConfigImportPath)) {
    collectionConfigImportPath = resolve(fileURLToPath(srcDir), './content/config.ts')
  }

  /** Map of virtual module names to their code contents as strings. */
  const modules = {
    'virtual:config': `export default ${JSON.stringify(opts)}`,
    'virtual:project-context': `export default ${JSON.stringify({
      build: { format: build.format },
      legacyCollections: legacy.collections,
      root,
      srcDir,
      trailingSlash
    })}`,
    /**
     * Module containing imports of user-specified custom CSS files.
     */
    'virtual:user-css': opts.customCss.map((id) => `import ${resolveId(id)};`).join(''),
    'virtual:collection-config': `let userCollections;
			try {
				userCollections = (await import(${resolveId('./content/config.ts', srcDir)})).collections;
			} catch {}
			export const collections = userCollections;`
  } satisfies Record<string, string>

  /** Mapping names prefixed with `\0` to their original form. */
  const resolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key
    ])
  )

  return {
    name: 'vite-plugin-starlight-user-config',
    resolveId(id): string | void {
      if (id in modules) return resolveVirtualModuleId(id)
    },
    load(id): string | void {
      const resolution = resolutionMap[id]
      if (resolution) return modules[resolution]
    }
  }
}
