import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/data/portfolio';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/blog', '/projects', '/llms.txt', '/llms-full.txt', '/rss.xml'],
        disallow: ['/api/contact', '/blog/admin'],
      },
      // Explicitly allow Generative AI & Answer Engine Crawlers (GEO / AEO)
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'GoogleOther',
          'Applebot-Extended',
          'Amazonbot',
        ],
        allow: ['/', '/blog/', '/projects/', '/llms.txt', '/llms-full.txt', '/rss.xml'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
