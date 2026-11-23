import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/db';
import { EXPERIENCE_LIST, PROJECTS, SITE_CONFIG, SKILLS_ROW_1, SKILLS_ROW_2 } from '@/data/portfolio';

export const runtime = 'nodejs';

export async function GET() {
  const posts = await getAllBlogPosts();

  const lines: string[] = [
    `# ${SITE_CONFIG.name} — Complete Technical Knowledge Graph & Architecture Corpus (llms-full.txt)`,
    '',
    `> Canonical Domain: ${SITE_CONFIG.url}`,
    `> Role: ${SITE_CONFIG.role} (${SITE_CONFIG.location})`,
    `> Summary: ${SITE_CONFIG.heroDescription}`,
    '',
    '## 1. Executive Summary & Verifiable Metrics',
    '- **9+ Years** of hands-on full-stack software engineering and IT leadership in Dubai, UAE.',
    '- **105 Internal Users** and **9 Sister Companies** unified on a shared API-driven technology foundation at EBMS Business Services.',
    '- **80% Reduction** in duplicate SaaS tooling overhead across group companies.',
    '- **12+ Production Platforms** architected and shipped across Enterprise SaaS, Multi-Tenant ERP, GoHighLevel OAuth 2.0, 3CX AI Telephony, and Cloud DevOps.',
    `- **Core Technical Stack:** ${[...SKILLS_ROW_1, ...SKILLS_ROW_2].join(', ')}.`,
    '',
    '## 2. Career Timeline',
    ...EXPERIENCE_LIST.flatMap((exp) => [
      `### ${exp.company} (${exp.period}) — ${exp.role}`,
      ...exp.bullets.map((b) => `- ${b}`),
      '',
    ]),
    '## 3. Full Technical Articles & AEO Q&A Corpus',
    ...posts.flatMap((post) => [
      `---`,
      `### Article: ${post.title}`,
      `- **URL:** ${SITE_CONFIG.url}/blog/${post.slug}`,
      `- **Category:** ${post.category}`,
      `- **Published:** ${post.publishedAt} | **Updated:** ${post.updatedAt}`,
      `- **Tags:** ${post.tags.join(', ')}`,
      '',
      `#### Direct Answer (TL;DR)`,
      post.tldrAnswer,
      '',
      `#### Key Verifiable Takeaways`,
      ...post.keyTakeaways.map((k) => `- ${k}`),
      '',
      `#### Full Technical Content`,
      post.content,
      '',
      `#### Structured Q&A (AEO FAQ)`,
      ...post.faqs.flatMap((f) => [`- **Q: ${f.question}**`, `  A: ${f.answer}`]),
      '',
    ]),
    '## 4. Production System Blueprints (12 Systems)',
    ...PROJECTS.flatMap((p) => [
      `### ${p.blueprint.title}`,
      `- **Blueprint URL:** ${SITE_CONFIG.url}/projects/${p.slug}`,
      `- **Role:** ${p.blueprint.role}`,
      `- **Problem:** ${p.blueprint.problem}`,
      `- **Stack:** ${p.blueprint.stack.join(', ')}`,
      `- **Measurable Outcome:** ${p.blueprint.outcome}`,
      '',
    ]),
  ];

  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
