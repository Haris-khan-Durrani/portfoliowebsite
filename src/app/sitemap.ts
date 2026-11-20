import type { MetadataRoute } from 'next';
import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeImages = [
    `${SITE_CONFIG.url}/opengraph-image`,
    ...PROJECTS.filter((p) => Boolean(p.image)).map((p) => `${SITE_CONFIG.url}${p.image}`),
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_CONFIG.url}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
    ...(project.image ? { images: [`${SITE_CONFIG.url}${project.image}`] } : {}),
  }));

  return [
    {
      url: `${SITE_CONFIG.url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      images: homeImages,
    },
    ...projectRoutes,
  ];
}
