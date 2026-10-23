import type { MetadataRoute } from "next"

// Required for `output: 'export'` so the file is emitted at build time.
export const dynamic = "force-static"

// AI search and training crawlers, named explicitly so the site's intent is
// unambiguous even where a crawler treats the wildcard rule conservatively.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: "https://www.mirascapital.com/sitemap.xml",
    host: "https://www.mirascapital.com",
  }
}
