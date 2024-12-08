import type { APIRoute } from 'astro'

const robotsTxt = `
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Claude-Web

User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}
`.trim()

export const GET: APIRoute = () =>
  new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  })
