import type { MetadataRoute } from 'next';
import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE_CONFIG.url}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectRoutes,
  ];
}
