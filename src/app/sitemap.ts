import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/db';
import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';
import { UAE_SOLUTIONS } from '@/data/solutions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogPosts = await getAllBlogPosts();

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

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
    ...(post.coverImage ? { images: [`${SITE_CONFIG.url}${post.coverImage}`] } : {}),
  }));

  const solutionRoutes: MetadataRoute.Sitemap = UAE_SOLUTIONS.map((sol) => ({
    url: `${SITE_CONFIG.url}/solutions/${sol.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.92,
  }));

  return [
    {
      url: `${SITE_CONFIG.url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      images: homeImages,
    },
    {
      url: `${SITE_CONFIG.url}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_CONFIG.url}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.93,
    },
    ...solutionRoutes,
    ...blogRoutes,
    ...projectRoutes,
  ];
}
