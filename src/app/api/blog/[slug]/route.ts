import { NextResponse } from 'next/server';
import {
  deleteBlogPostBySlug,
  evaluateSeoAeoGeoScore,
  getBlogPostBySlug,
} from '@/lib/db';
import { SITE_CONFIG } from '@/data/portfolio';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ success: false, error: 'Article not found.' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  // GEO raw markdown mode for AI agents & LLM citation extraction (?format=md)
  if (searchParams.get('format') === 'md') {
    const md = [
      `# ${post.title}`,
      `> **Author:** ${post.authorName} (${post.authorRole})`,
      `> **Canonical URL:** ${SITE_CONFIG.url}/blog/${post.slug}`,
      `> **Published:** ${post.publishedAt} | **Updated:** ${post.updatedAt}`,
      `> **Category:** ${post.category} | **Tags:** ${post.tags.join(', ')}`,
      '',
      '## TL;DR — Direct Answer (AEO / GEO Summary)',
      post.tldrAnswer,
      '',
      '## Key Verifiable Takeaways',
      ...post.keyTakeaways.map((k) => `- ${k}`),
      '',
      post.content,
      '',
      '## Frequently Asked Questions (AEO)',
      ...post.faqs.flatMap((f) => [`### Q: ${f.question}`, `${f.answer}`, '']),
    ].join('\n');

    return new NextResponse(md, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'X-Robots-Tag': 'index, follow',
      },
    });
  }

  return NextResponse.json({
    success: true,
    score: evaluateSeoAeoGeoScore(post),
    post,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteBlogPostBySlug(slug);
  return NextResponse.json({ success: true, deletedSlug: slug });
}
