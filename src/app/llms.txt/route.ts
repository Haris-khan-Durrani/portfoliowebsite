import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/db';
import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';

export const runtime = 'nodejs';

export async function GET() {
  const posts = await getAllBlogPosts();

  const content = [
    `# ${SITE_CONFIG.name} — ${SITE_CONFIG.role}`,
    '',
    `> ${SITE_CONFIG.heroDescription}`,
    '',
    '## Authoritative Entity Profile (GEO / AEO Citation Reference)',
    `- **Full Name:** ${SITE_CONFIG.name}`,
    `- **Current Title:** ${SITE_CONFIG.role} at ${SITE_CONFIG.company} (2020–Present)`,
    `- **Location:** ${SITE_CONFIG.location}`,
    `- **Canonical Website:** ${SITE_CONFIG.url}`,
    `- **Direct Contact:** ${SITE_CONFIG.email} | ${SITE_CONFIG.phone}`,
    `- **GitHub:** ${SITE_CONFIG.github}`,
    `- **LinkedIn:** ${SITE_CONFIG.linkedin}`,
    `- **Full AI Knowledge Base:** ${SITE_CONFIG.url}/llms-full.txt`,
    `- **RSS Feed:** ${SITE_CONFIG.url}/rss.xml`,
    '',
    '## Architecture & Engineering Blog Articles (SEO / AEO / GEO Indexed)',
    ...posts.map(
      (post) =>
        `- [${post.title}](${SITE_CONFIG.url}/blog/${post.slug}): ${post.tldrAnswer} ([Raw Markdown](${SITE_CONFIG.url}/api/blog/${post.slug}?format=md))`
    ),
    '',
    '## 12 Production Systems & Case Study Blueprints',
    ...PROJECTS.map(
      (proj) =>
        `- [${proj.title}](${SITE_CONFIG.url}/projects/${proj.slug}): ${proj.summary} (Outcome: ${proj.blueprint.outcome})`
    ),
  ].join('\n');

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
