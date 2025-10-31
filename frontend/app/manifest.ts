import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HyggeHub.io',
    short_name: 'HyggeHub',
    description: 'HyggeHub.io - Notify Your Crowd. Instantly.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000',
    theme_color: '#fff',
    icons: [
      {
        src: '/HyggeHub-logo.svg',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}