import { createHash } from 'node:crypto'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import siteConfig from '../../src/site.config'

type Friend = {
  name: string
  intro: string
  link: string
  avatar: string
  avatar_cache?: {
    hash: string
    path: string
  }
}

type FriendGroup = {
  id_name: string
  desc: string
  link_list: Friend[]
}

type LinksJson = {
  friends: FriendGroup[]
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')
const linksJsonPath = path.join(projectRoot, 'public', 'links.json')
const avatarOutputDir = path.join(projectRoot, 'public', 'avatars')

const cacheAvatar = siteConfig.integ?.links?.cacheAvatar ?? false

if (!cacheAvatar) {
  console.log(
    '[avatar-cache] Avatar caching disabled. Set cacheAvatar=true in site.config.ts to enable.'
  )
  process.exit(0)
}

const CONTENT_TYPE_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/avif': 'avif'
}

function createAvatarHash(url: string) {
  return createHash('sha256').update(url).digest('hex').slice(0, 16)
}

function extractExtensionFromUrl(url: string) {
  try {
    const pathname = new URL(url).pathname
    const ext = path.extname(pathname)
    if (ext) {
      return ext.replace(/^\./, '').split('?')[0]
    }
  } catch {
    // Ignore invalid URLs
  }
  return ''
}

function resolveExtension(url: string, contentType?: string | null) {
  const mime = contentType?.split(';')[0]?.trim().toLowerCase()
  if (mime && CONTENT_TYPE_EXTENSION_MAP[mime]) {
    return CONTENT_TYPE_EXTENSION_MAP[mime]
  }

  const fromUrl = extractExtensionFromUrl(url)
  if (fromUrl) {
    return fromUrl
  }

  return 'png'
}

async function ensureFileExists(filePath: string) {
  try {
    await access(filePath)
    // Break if the existing file is zero bytes (partial download)
    const info = await stat(filePath)
    return info.isFile() && info.size > 0
  } catch {
    return false
  }
}

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    const response = await fetch(url, { redirect: 'follow', signal: controller.signal })
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    return response
  } finally {
    clearTimeout(timer)
  }
}

async function cacheFriendAvatar(friend: Friend) {
  if (!friend.avatar.trim().startsWith('http')) {
    // Local avatars are already bundled under public/
    const hadCache = Boolean(friend.avatar_cache)
    friend.avatar_cache = undefined
    return hadCache
  }

  const hash = createAvatarHash(friend.avatar)
  const existingCache = friend.avatar_cache
  const expectedExt = existingCache?.path ? path.extname(existingCache.path).replace(/^\./, '') : ''
  const potentialFile = expectedExt
    ? path.join(avatarOutputDir, `${hash}.${expectedExt}`)
    : undefined

  if (existingCache?.hash === hash && potentialFile && (await ensureFileExists(potentialFile))) {
    // Ensure the cache path stays normalised even if the JSON was edited manually
    const normalisedPath = `/avatars/${hash}.${expectedExt}`
    const mutated = existingCache.path !== normalisedPath
    friend.avatar_cache = {
      hash,
      path: normalisedPath
    }
    return mutated
  }

  try {
    const response = await fetchWithTimeout(friend.avatar, 10_000)
    const extension = resolveExtension(friend.avatar, response.headers.get('content-type'))
    const fileName = `${hash}.${extension}`
    const targetPath = path.join(avatarOutputDir, fileName)

    try {
      const buffer = Buffer.from(await response.arrayBuffer())
      await writeFile(targetPath, buffer)
      friend.avatar_cache = {
        hash,
        path: `/avatars/${fileName}`
      }
      return true
    } catch (error) {
      console.warn(
        `[avatar-cache] Failed to cache ${friend.name} avatar: ${(error as Error).message}`
      )
      friend.avatar_cache = undefined
      return Boolean(existingCache)
    }
  } catch (error) {
    console.warn(
      `[avatar-cache] Failed to fetch ${friend.name} avatar: ${(error as Error).message}`
    )
    friend.avatar_cache = undefined
    return Boolean(existingCache)
  }
}

async function main() {
  const raw = await readFile(linksJsonPath, 'utf-8')
  const links = JSON.parse(raw) as LinksJson

  await mkdir(avatarOutputDir, { recursive: true })

  let updated = false
  for (const group of links.friends) {
    for (const friend of group.link_list) {
      const changed = await cacheFriendAvatar(friend)
      if (changed) {
        updated = true
      }
    }
  }

  const serialised = `${JSON.stringify(links, null, 2)}\n`
  if (serialised !== raw) {
    await writeFile(linksJsonPath, serialised, 'utf-8')
    console.log(
      updated
        ? '[avatar-cache] links.json updated with fresh avatar caches.'
        : '[avatar-cache] links.json metadata refreshed (no new downloads required).'
    )
  } else {
    console.log('[avatar-cache] No changes needed.')
  }
}

main().catch((error) => {
  console.error('[avatar-cache] Unexpected failure:', error)
  process.exitCode = 1
})
