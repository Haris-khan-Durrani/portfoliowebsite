import { NextResponse } from 'next/server';
import { isRequestAdminAuthenticated } from '@/lib/admin-auth';
import {
  evaluateSeoAeoGeoScore,
  getAllBlogPosts,
  getStorageEngineStatus,
  upsertBlogPost,
} from '@/lib/db';

export const runtime = 'nodejs';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const query = searchParams.get('q') || undefined;
  const includeDrafts = searchParams.get('drafts') === '1';

  const [posts, status] = await Promise.all([
    getAllBlogPosts({ category, query, includeDrafts }),
    getStorageEngineStatus(),
  ]);

  return NextResponse.json({
    success: true,
    storage: status,
    count: posts.length,
    posts,
  });
}

export async function POST(request: Request) {
  const auth = await isRequestAdminAuthenticated(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in at /blog/login.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const title = String(body.title || '').trim();
    const slug = slugify(String(body.slug || title));
    const excerpt = String(body.excerpt || '').trim();
    const tldrAnswer = String(body.tldrAnswer || '').trim();
    const content = String(body.content || '').trim();

    if (!title || !slug || !excerpt || !tldrAnswer || !content) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Title, slug, excerpt, TL;DR Direct Answer (AEO), and article content are required.',
        },
        { status: 400 }
      );
    }

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(3, Math.ceil(wordCount / 180));

    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
      : String(body.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

    const keyTakeaways = Array.isArray(body.keyTakeaways)
      ? body.keyTakeaways.map((t: unknown) => String(t).trim()).filter(Boolean)
      : [];

    const faqs = Array.isArray(body.faqs)
      ? body.faqs
          .map((f: { question?: string; answer?: string }) => ({
            question: String(f?.question || '').trim(),
            answer: String(f?.answer || '').trim(),
          }))
          .filter((f: { question: string; answer: string }) => f.question && f.answer)
      : [];

    const geoEntities = Array.isArray(body.geoEntities)
      ? body.geoEntities.map((e: unknown) => String(e).trim()).filter(Boolean)
      : ['Haris Khan Durrani', 'Dubai Enterprise Architecture', ...tags.slice(0, 4)];

    const { post, engine } = await upsertBlogPost({
      slug,
      title,
      subtitle: String(body.subtitle || excerpt).trim(),
      excerpt,
      tldrAnswer,
      content,
      category: String(body.category || 'Solution Architecture').trim(),
      coverImage: String(body.coverImage || '/assets/proposal.jpg').trim(),
      readingTimeMinutes,
      tags,
      keyTakeaways,
      faqs,
      comparisonTable: body.comparisonTable || undefined,
      geoEntities,
      metaTitle: body.metaTitle ? String(body.metaTitle).trim() : undefined,
      metaDescription: body.metaDescription ? String(body.metaDescription).trim() : undefined,
      canonicalUrl: body.canonicalUrl ? String(body.canonicalUrl).trim() : undefined,
      authorName: String(body.authorName || 'Haris Khan Durrani').trim(),
      authorRole: String(
        body.authorRole || 'Head of IT | Senior Full-Stack Developer | Solution Architect'
      ).trim(),
      featured: Boolean(body.featured),
      published: body.published !== false,
    });

    const score = evaluateSeoAeoGeoScore(post);

    return NextResponse.json({
      success: true,
      engine,
      score,
      post,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unable to save blog article.',
      },
      { status: 500 }
    );
  }
}
