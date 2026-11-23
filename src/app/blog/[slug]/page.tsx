import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  ShieldCheck,
  Sparkles,
  Table2,
} from 'lucide-react';
import { evaluateSeoAeoGeoScore, getAllBlogPosts, getBlogPostBySlug } from '@/lib/db';
import { SITE_CONFIG } from '@/data/portfolio';
import { BlogArticleJsonLd } from '@/components/seo/BlogJsonLd';
import { ArticleActionsBar } from '@/components/blog/ArticleActionsBar';
import { Footer } from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  const canonical = post.canonicalUrl || `${SITE_CONFIG.url}/blog/${post.slug}`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.tldrAnswer || post.excerpt,
    keywords: [...post.tags, ...post.geoEntities],
    authors: [{ name: post.authorName, url: SITE_CONFIG.url }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title: post.title,
      description: post.tldrAnswer || post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: post.coverImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.tldrAnswer || post.excerpt,
      images: [post.coverImage],
    },
  };
}

function renderInlineFormatting(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-[var(--page-text)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="rounded border border-[var(--line)] bg-[var(--surface-card)] px-1.5 py-0.5 font-mono text-[12.5px] text-[var(--acid)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
          rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
          className="font-semibold text-[var(--acid)] underline decoration-[var(--acid)]/50 underline-offset-4 hover:text-[var(--cyan)]"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

function renderMarkdownBlocks(markdown: string): {
  headings: { id: string; text: string; level: 2 | 3 }[];
  elements: ReactNode[];
} {
  const lines = markdown.split('\n');
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  const elements: ReactNode[] = [];

  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'typescript';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div
          key={`code-${key++}`}
          className="my-6 overflow-hidden rounded-2xl border border-white/15 bg-[#08090e] shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0f111a] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c8ff3d]">
            <span>PRODUCTION SNIPPET // {lang}</span>
            <span className="text-white/45">VERIFIED</span>
          </div>
          <pre className="m-0 overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.7] text-slate-200">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(<hr key={`hr-${key++}`} className="my-8 border-t border-[var(--line)]" />);
      i++;
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text, level: 2 });
      elements.push(
        <h2
          key={`h2-${key++}`}
          id={id}
          className="mb-3 mt-9 scroll-mt-24 text-[clamp(22px,2.5vw,30px)] font-extrabold tracking-[-0.03em] text-[var(--page-text)]"
        >
          {text}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ id, text, level: 3 });
      elements.push(
        <h3
          key={`h3-${key++}`}
          id={id}
          className="mb-2.5 mt-7 scroll-mt-24 text-lg font-extrabold tracking-[-0.02em] text-[var(--cyan)]"
        >
          {text}
        </h3>
      );
      i++;
      continue;
    }

    // Unordered or Ordered List
    if (/^(\s*[-*]|\s*\d+\.)\s+/.test(line)) {
      const listItems: string[] = [];
      const isOrdered = /^\s*\d+\.\s+/.test(line);
      while (i < lines.length && /^(\s*[-*]|\s*\d+\.)\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^(\s*[-*]|\s*\d+\.)\s+/, ''));
        i++;
      }
      const ListTag = isOrdered ? 'ol' : 'ul';
      elements.push(
        <ListTag
          key={`list-${key++}`}
          className={`my-4 space-y-2.5 pl-6 text-[15px] leading-[1.75] text-[var(--text-soft)] ${
            isOrdered ? 'list-decimal' : 'list-disc'
          }`}
        >
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineFormatting(item)}</li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Paragraph
    if (line.trim()) {
      elements.push(
        <p
          key={`p-${key++}`}
          className="my-4 text-[15.5px] leading-[1.8] text-[var(--text-soft)]"
        >
          {renderInlineFormatting(line.trim())}
        </p>
      );
    }
    i++;
  }

  return { headings, elements };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(slug), getAllBlogPosts()]);
  if (!post) notFound();

  const canonicalUrl = post.canonicalUrl || `${SITE_CONFIG.url}/blog/${post.slug}`;
  const score = evaluateSeoAeoGeoScore(post);
  const { headings, elements } = renderMarkdownBlocks(post.content);

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = allPosts[(currentIndex - 1 + allPosts.length) % allPosts.length];
  const nextPost = allPosts[(currentIndex + 1) % allPosts.length];

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <BlogArticleJsonLd post={post} />
      <div className="arch-grid-bg" aria-hidden="true" />

      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1220px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--page-text)] transition-colors hover:text-[var(--acid)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
              <span>All Articles</span>
            </Link>
            <span className="text-[var(--line)]">/</span>
            <Link
              href="/"
              className="font-mono text-xs text-[var(--text-soft)] hover:text-[var(--page-text)]"
            >
              Portfolio
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="rounded-full border border-[var(--acid)]/40 bg-[var(--acid)]/10 px-3 py-1 font-mono text-[10px] font-bold text-[var(--acid)]">
              SEO · AEO · GEO Score: {score.total}/100
            </span>
            <Link
              href="/blog/admin"
              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)]"
            >
              Edit in CMS
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-[1220px] px-5 py-10 sm:px-8 sm:py-14">
        <article itemScope itemType="https://schema.org/TechArticle">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-5 font-mono text-[11px] text-[var(--text-faint)]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[var(--acid)]">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-[var(--acid)]">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="truncate text-[var(--acid)]">{post.category}</li>
            </ol>
          </nav>

          {/* Category + Read Time Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="rounded-full border border-[var(--acid)]/35 bg-[var(--acid)]/10 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--text-soft)]">
              <Clock className="h-3.5 w-3.5 text-[var(--cyan)]" />
              {post.readingTimeMinutes} min technical read
            </span>
            <span className="text-[var(--text-faint)]">•</span>
            <time dateTime={post.updatedAt} className="text-[var(--text-faint)]">
              Updated{' '}
              {new Date(post.updatedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          {/* Monumental Article Headline (AEO Speakable Target) */}
          <h1
            data-speakable="headline"
            itemProp="headline"
            className="m-0 text-[clamp(28px,4.5vw,56px)] font-extrabold leading-[1.06] tracking-[-0.04em] text-[var(--page-text)]"
          >
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-[var(--text-soft)] sm:text-lg">
              {post.subtitle}
            </p>
          )}

          {/* Author E-E-A-T Bar + GEO Citation Actions */}
          <div className="mt-7 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3.5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--acid)]/50 bg-[var(--acid)]/15 font-mono text-xs font-black text-[var(--acid)]">
                HKD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-extrabold text-[var(--page-text)]">
                    {post.authorName}
                  </strong>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[9.5px] font-bold text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Architect
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[var(--text-soft)]">
                  {post.authorRole} · {SITE_CONFIG.locationShort}
                </div>
              </div>
            </div>

            <ArticleActionsBar
              title={post.title}
              slug={post.slug}
              canonicalUrl={canonicalUrl}
              tldrAnswer={post.tldrAnswer}
              authorName={post.authorName}
            />
          </div>

          {/* Cover Image */}
          <div className="relative mt-8 aspect-[16/8.5] w-full overflow-hidden rounded-[26px] border border-[var(--line)] bg-[#07080d] shadow-[0_30px_90px_var(--shadow)]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1220px) 100vw, 1180px"
              className="object-cover"
            />
          </div>

          {/* 2-Column Layout: Main Article Content + Sticky AEO/GEO Intelligence Sidebar */}
          <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            {/* Main Column (8 cols) */}
            <div className="lg:col-span-8">
              {/* 1. AEO DIRECT ANSWER BOX (Speakable + Featured Snippet Target) */}
              <section
                aria-label="Direct Answer Summary"
                data-speakable="tldr"
                className="mb-8 rounded-[24px] border-2 border-[var(--acid)]/45 bg-gradient-to-br from-[var(--acid)]/[0.08] via-[var(--surface)] to-[var(--surface)] p-6 shadow-[0_20px_50px_var(--shadow)] sm:p-7"
              >
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--acid)]">
                    <Sparkles className="h-4 w-4" />
                    TL;DR — Direct Architectural Answer (AEO / AI Overview)
                  </span>
                  <span className="rounded-full border border-[var(--acid)]/30 bg-[var(--acid)]/10 px-2.5 py-0.5 font-mono text-[9.5px] font-bold text-[var(--acid)]">
                    Speakable Schema
                  </span>
                </div>
                <p className="m-0 text-[15.5px] font-medium leading-[1.75] text-[var(--page-text)]">
                  {post.tldrAnswer}
                </p>
              </section>

              {/* 2. GEO VERIFIABLE KEY TAKEAWAYS & BENCHMARKS */}
              {post.keyTakeaways.length > 0 && (
                <section
                  aria-label="Key Verifiable Takeaways"
                  data-speakable="takeaways"
                  className="mb-9 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-7"
                >
                  <h2 className="m-0 mb-4 flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--cyan)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--acid)]" />
                    <span>Key Production Benchmarks &amp; Takeaways (GEO Citation Facts)</span>
                  </h2>
                  <ul className="m-0 space-y-3 pl-0 list-none">
                    {post.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14.5px] leading-[1.7] text-[var(--text-soft)]">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--acid)]/15 font-mono text-[10px] font-bold text-[var(--acid)]">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 3. Main Long-Form Technical Content */}
              <div itemProp="articleBody" className="prose-container">
                {elements}
              </div>

              {/* 4. GEO STRUCTURED COMPARISON TABLE (High-Probability LLM Extraction Matrix) */}
              {post.comparisonTable && (
                <section
                  aria-label="Architectural Comparison Matrix"
                  className="my-10 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)]"
                >
                  <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[var(--surface-card)] px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    <Table2 className="h-4 w-4" />
                    <span>{post.comparisonTable.caption}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-[var(--line)] bg-[var(--surface-card)]/60 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-soft)]">
                          {post.comparisonTable.headers.map((h, idx) => (
                            <th key={idx} className="px-5 py-3.5 font-bold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line-subtle)]">
                        {post.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[var(--page-text)]/[0.02]">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-5 py-3.5 text-[13.5px] leading-relaxed ${
                                  cIdx === 0
                                    ? 'font-bold text-[var(--page-text)]'
                                    : cIdx === row.length - 1
                                      ? 'font-semibold text-[var(--acid)]'
                                      : 'text-[var(--text-soft)]'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* 5. AEO FREQUENTLY ASKED QUESTIONS (Synced with FAQPage JSON-LD) */}
              {post.faqs.length > 0 && (
                <section
                  id="faq"
                  aria-labelledby="faq-heading"
                  className="mt-12 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8"
                >
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <div className="mb-1 flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>AEO FAQPage Schema</span>
                      </div>
                      <h2
                        id="faq-heading"
                        className="m-0 text-2xl font-extrabold tracking-[-0.03em] text-[var(--page-text)]"
                      >
                        Frequently Asked Technical Questions
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {post.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-5"
                      >
                        <h3 className="m-0 mb-2 text-base font-extrabold text-[var(--page-text)]">
                          Q{idx + 1}. {faq.question}
                        </h3>
                        <p className="m-0 text-sm leading-[1.75] text-[var(--text-soft)]">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky Sidebar: Table of Contents + Knowledge Graph Entities + Score Card (4 cols) */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5">
                  <div className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                    On This Page
                  </div>
                  <nav aria-label="Table of contents" className="space-y-2 text-xs">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block text-[var(--text-soft)] transition-colors hover:text-[var(--acid)] ${
                          h.level === 3 ? 'pl-3.5 text-[11.5px]' : 'font-semibold'
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                    {post.faqs.length > 0 && (
                      <a
                        href="#faq"
                        className="block font-semibold text-[var(--cyan)] hover:text-[var(--acid)]"
                      >
                        Frequently Asked Questions ({post.faqs.length})
                      </a>
                    )}
                  </nav>
                </div>
              )}

              {/* SEO / AEO / GEO Readiness Breakdown */}
              <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                    Search &amp; AI Indexing Score
                  </span>
                  <span className="font-mono text-sm font-black text-[var(--acid)]">
                    {score.total}/100
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-2.5">
                    <div className="text-[10px] text-[var(--text-faint)]">SEO</div>
                    <div className="mt-0.5 font-extrabold text-[var(--acid)]">{score.seo}%</div>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-2.5">
                    <div className="text-[10px] text-[var(--text-faint)]">AEO</div>
                    <div className="mt-0.5 font-extrabold text-[var(--cyan)]">{score.aeo}%</div>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-2.5">
                    <div className="text-[10px] text-[var(--text-faint)]">GEO</div>
                    <div className="mt-0.5 font-extrabold text-emerald-400">{score.geo}%</div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 pl-0 list-none text-[11.5px] text-[var(--text-soft)]">
                  {score.checks.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--acid)]" />
                      <span>
                        <strong className="font-mono text-[10px] text-[var(--page-text)]">
                          [{c.pillar}]
                        </strong>{' '}
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* GEO Knowledge Graph Entities */}
              <div className="rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-5">
                <div className="mb-3 flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--cyan)]">
                  <Layers className="h-3.5 w-3.5" />
                  <span>GEO Knowledge Graph Entities</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {post.geoEntities.map((entity) => (
                    <span
                      key={entity}
                      className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-2.5 py-1 font-mono text-[10px] text-[var(--page-text)]"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Adjacent Article Navigation */}
          <nav
            aria-label="Adjacent articles"
            className="mt-14 grid grid-cols-1 gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2"
          >
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--acid)]"
              >
                <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                  <ArrowLeft className="h-3.5 w-3.5 text-[var(--acid)]" />
                  <span>Previous Article</span>
                </div>
                <div className="line-clamp-2 text-sm font-extrabold text-[var(--page-text)] group-hover:text-[var(--acid)]">
                  {prevPost.title}
                </div>
              </Link>
            )}

            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition-colors hover:border-[var(--acid)] sm:text-right"
              >
                <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                  <span>Next Article</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--acid)]" />
                </div>
                <div className="line-clamp-2 text-sm font-extrabold text-[var(--page-text)] group-hover:text-[var(--acid)]">
                  {nextPost.title}
                </div>
              </Link>
            )}
          </nav>
        </article>
      </main>

      <Footer />
    </div>
  );
}
