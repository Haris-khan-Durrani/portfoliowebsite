import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/data/portfolio';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_CONFIG.name} — Head of IT & Solution Architect`,
    short_name: 'HKD Portfolio',
    description: SITE_CONFIG.heroDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#060608',
    theme_color: '#c8ff3d',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
