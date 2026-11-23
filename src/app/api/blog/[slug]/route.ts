import { NextResponse } from 'next/server';
import { isRequestAdminAuthenticated } from '@/lib/admin-auth';
import {
  deleteBlogPostBySlug,
  evaluateSeoAeoGeoScore,
  getBlogPostBySlug,
  upsertBlogPost,
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

// Quick partial update (toggle published / featured / etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await isRequestAdminAuthenticated(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in at /blog/login.' },
      { status: 401 }
    );
  }

  const { slug } = await params;
  const existing = await getBlogPostBySlug(slug);
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Article not found.' }, { status: 404 });
  }

  const patch = await request.json();
  const { post, engine } = await upsertBlogPost({
    ...existing,
    featured: typeof patch.featured === 'boolean' ? patch.featured : existing.featured,
    published: typeof patch.published === 'boolean' ? patch.published : existing.published,
    title: patch.title ?? existing.title,
    category: patch.category ?? existing.category,
    coverImage: patch.coverImage ?? existing.coverImage,
  });

  return NextResponse.json({
    success: true,
    engine,
    post,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await isRequestAdminAuthenticated(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in at /blog/login.' },
      { status: 401 }
    );
  }

  const { slug } = await params;
  await deleteBlogPostBySlug(slug);
  return NextResponse.json({ success: true, deletedSlug: slug });
}
