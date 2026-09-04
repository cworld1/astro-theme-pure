import { fileURLToPath } from 'node:url'
// Astro
import type { AstroIntegrationLogger } from 'astro'
import { AstroError } from 'astro/errors'
// Pagefind
import * as pagefind from 'pagefind'

interface PagefindOptions {
  /** The build output directory, as provided by the `astro:build:done` hook. */
  dir: URL
  /** The integration logger, as provided by the `astro:build:done` hook. */
  logger: AstroIntegrationLogger
}

interface PagefindResponse {
  errors: string[]
}

/**
 * Build the Pagefind search index for the generated site.
 *
 * This uses the Pagefind Node API instead of spawning the `pagefind` CLI through `npx`, so the
 * build no longer requires Node.js and npm to be available alongside the package manager actually
 * used to install the project (e.g. Bun-only Docker images).
 *
 * @see https://pagefind.app/docs/node-api/
 */
export async function buildPagefindIndex({ dir, logger: integrationLogger }: PagefindOptions) {
  const logger = integrationLogger.fork('astro-pure:pagefind')

  try {
    const start = performance.now()
    logger.info('Building search index with Pagefind...')

    const { index } = assertNoErrors(await pagefind.createIndex(), logger)
    if (!index) throw new Error('Pagefind did not return an index.')

    const { page_count } = assertNoErrors(
      await index.addDirectory({ path: fileURLToPath(dir) }),
      logger
    )
    logger.info(`Found ${page_count} HTML file(s).`)

    assertNoErrors(
      await index.writeFiles({ outputPath: fileURLToPath(new URL('./pagefind/', dir)) }),
      logger
    )

    const elapsed = performance.now() - start
    logger.info(
      `Finished building search index in ${
        elapsed < 750 ? `${Math.round(elapsed)}ms` : `${(elapsed / 1000).toFixed(2)}s`
      }.`
    )
  } catch (cause) {
    throw new AstroError(
      'Failed to build the Pagefind search index.',
      cause instanceof Error ? cause.message : String(cause)
    )
  } finally {
    await pagefind.close()
  }
}

/** Surface any error reported by Pagefind, which resolves instead of rejecting on failure. */
function assertNoErrors<T extends PagefindResponse>(response: T, logger: AstroIntegrationLogger) {
  if (response.errors.length > 0) {
    for (const error of response.errors) logger.error(error)
    throw new Error('Pagefind response contained errors.')
  }
  return response
}
