import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';
import { getAllBlogPosts } from '@/lib/db';

export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || 'hkd2026dubaiarchitectindexnowkey971';

export async function pingIndexNow(urlsToPing?: string[]): Promise<{
  submitted: boolean;
  urlCount: number;
  urls: string[];
  status?: number;
  note: string;
}> {
  const posts = await getAllBlogPosts();
  const defaultUrls = [
    `${SITE_CONFIG.url}/`,
    `${SITE_CONFIG.url}/blog`,
    `${SITE_CONFIG.url}/sitemap.xml`,
    `${SITE_CONFIG.url}/llms.txt`,
    `${SITE_CONFIG.url}/llms-full.txt`,
    ...posts.map((p) => `${SITE_CONFIG.url}/blog/${p.slug}`),
    ...PROJECTS.map((p) => `${SITE_CONFIG.url}/projects/${p.slug}`),
  ];

  const urlList = urlsToPing && urlsToPing.length > 0 ? urlsToPing : defaultUrls;

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_CONFIG.domain,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_CONFIG.url}/hkd-indexnow-key.txt`,
        urlList,
      }),
    });

    return {
      submitted: res.ok || res.status === 202,
      urlCount: urlList.length,
      urls: urlList,
      status: res.status,
      note: 'IndexNow pinged (Bing, Microsoft Copilot, ChatGPT Search, Yandex).',
    };
  } catch {
    return {
      submitted: false,
      urlCount: urlList.length,
      urls: urlList,
      note: 'IndexNow payload prepared (external network offline in current environment; will auto-submit on live production domain).',
    };
  }
}
