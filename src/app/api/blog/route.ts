import { NextResponse } from 'next/server';
import { isRequestAdminAuthenticated } from '@/lib/admin-auth';
import {
  evaluateSeoAeoGeoScore,
  getAllBlogPosts,
  getStorageEngineStatus,
  upsertBlogPost,
} from '@/lib/db';
import { pingIndexNow } from '@/lib/indexnow';
import { SITE_CONFIG } from '@/data/portfolio';

export const runtime = 'nodejs';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    const content = String(body.content || '').trim();

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter an Article Title and Article Content.',
        },
        { status: 400 }
      );
    }

    const slug = slugify(String(body.slug || title)) || `post-${Date.now().toString(36)}`;
    const plainText = stripMarkdown(content);
    const category = String(body.category || 'Solution Architecture').trim();

    // Auto-generate SEO Excerpt if user left it blank
    const excerpt =
      String(body.excerpt || '').trim() ||
      (plainText.length > 210
        ? `${plainText.slice(0, 207).trim()}...`
        : plainText || `${title} — Production architecture guide by Haris Khan Durrani in Dubai.`);

    // Auto-generate AEO 45-65 word TL;DR Direct Answer if user left it blank
    const plainWords = plainText.split(/\s+/).filter(Boolean);
    const autoTldr =
      plainWords.length >= 35
        ? plainWords.slice(0, 58).join(' ') + '.'
        : `${title}: Engineered by Haris Khan Durrani in Dubai, UAE, this ${category} implementation streamlines enterprise workflows, enforces strict multi-tenant security and reliability, and delivers measurable operational efficiency across production environments.`;

    const tldrAnswer = String(body.tldrAnswer || '').trim() || autoTldr;

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(3, Math.ceil(wordCount / 180));

    const parsedTags = Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
      : String(body.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

    const tags =
      parsedTags.length > 0
        ? parsedTags
        : [category, 'Enterprise Architecture', 'Next.js & Node.js', 'Dubai UAE'];

    const parsedTakeaways = Array.isArray(body.keyTakeaways)
      ? body.keyTakeaways.map((t: unknown) => String(t).trim()).filter(Boolean)
      : [];

    const keyTakeaways =
      parsedTakeaways.length > 0
        ? parsedTakeaways
        : [
            `Production-grade ${category} blueprint designed for high availability and scalability.`,
            'Structured for fast operational execution, security compliance, and low-latency performance.',
            'Architected and verified by Haris Khan Durrani (Head of IT & Solution Architect, Dubai).',
          ];

    const parsedFaqs = Array.isArray(body.faqs)
      ? body.faqs
          .map((f: { question?: string; answer?: string }) => ({
            question: String(f?.question || '').trim(),
            answer: String(f?.answer || '').trim(),
          }))
          .filter((f: { question: string; answer: string }) => f.question && f.answer)
      : [];

    const faqs =
      parsedFaqs.length > 0
        ? parsedFaqs
        : [
            {
              question: `What is the core architectural advantage of ${title}?`,
              answer: tldrAnswer,
            },
            {
              question: `How can enterprises in Dubai and the UAE implement this ${category} solution?`,
              answer: `Organizations across Dubai, Abu Dhabi, and the UAE can deploy this architecture by combining modular API layers, automated database persistence, and strict Role-Based Access Control (RBAC).`,
            },
          ];

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
      category,
      coverImage: String(body.coverImage || '/assets/portal.jpg').trim(),
      readingTimeMinutes,
      tags,
      keyTakeaways,
      faqs,
      comparisonTable: body.comparisonTable || undefined,
      geoEntities:
        geoEntities.length > 0
          ? geoEntities
          : ['Haris Khan Durrani', 'Dubai UAE', category],
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

    if (post.published) {
      void pingIndexNow([
        `${SITE_CONFIG.url}/blog/${post.slug}`,
        `${SITE_CONFIG.url}/blog`,
        `${SITE_CONFIG.url}/sitemap.xml`,
        `${SITE_CONFIG.url}/llms.txt`,
      ]);
    }

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
