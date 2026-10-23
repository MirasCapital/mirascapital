import type { MetadataRoute } from "next"

// Required for `output: 'export'` so the file is emitted at build time.
export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.mirascapital.com/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
