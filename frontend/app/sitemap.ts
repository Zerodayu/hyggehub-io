import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://hyggehub.io',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://hyggehub.io/updates',
      lastModified: new Date(),
      priority: 0.8,
    },
  ]
}