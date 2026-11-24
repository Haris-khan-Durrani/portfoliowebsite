'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Clock,
  Database,
  FileCode2,
  PlusCircle,
  Rss,
  Search,
  Sparkles,
} from 'lucide-react';
import type { BlogPost } from '@/data/blog-seed';
import { SITE_CONFIG } from '@/data/portfolio';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { cn } from '@/lib/utils';

interface BlogHubClientProps {
  initialPosts: BlogPost[];
  isAdmin?: boolean;
}

export function BlogHubClient({ initialPosts, isAdmin = false }: BlogHubClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCat =
        selectedCategory === 'all' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCat) return false;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tldrAnswer.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.geoEntities.some((e) => e.toLowerCase().includes(q))
      );
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const heroPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="arch-grid-bg" aria-hidden="true" />

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--page-text)] transition-colors hover:text-[var(--acid)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
              <span>Portfolio Home</span>
            </Link>
            <span className="text-[var(--line)]">/</span>
            <span className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
              Architecture Journal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)]"
            >
              <Rss className="h-3.5 w-3.5" />
              <span>RSS Feed</span>
            </a>

            {isAdmin && (
              <Link
                href="/blog/admin"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-4 py-1.5 font-mono text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[#060608]"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Write / Manage</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16">
        {/* Hero Banner */}
        <div className="mb-10 border-b border-[var(--line)] pb-10">
          <div className="mb-3 inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--acid)]/30 bg-[var(--acid)]/[0.07] px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
            <Sparkles className="h-3 w-3" />
            <span>Production Case Studies &amp; Solution Architecture</span>
          </div>

          <h1 className="m-0 text-[clamp(36px,5.6vw,78px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-[var(--page-text)]">
            Engineering &amp; Architecture{' '}
            <span className="hero-gradient-text font-serif font-normal italic">Blueprints.</span>
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-soft)]">
            Real-world engineering breakdowns, system architecture notes, and lessons learned building
            multi-tenant SaaS, ERP/CRM platforms, AI telephony gateways, and cloud infrastructure in
            Dubai.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="mt-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'rounded-full border px-4 py-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] transition-all cursor-pointer',
                      active
                        ? 'border-[var(--acid)] bg-[var(--acid)] text-[#060608] shadow-[0_4px_18px_var(--acid-glow)]'
                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)] hover:border-[var(--acid)]/50 hover:text-[var(--page-text)]'
                    )}
                  >
                    {cat === 'all' ? `All Articles (${initialPosts.length})` : cat}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GHL, 3CX, Prisma, AES-256..."
                aria-label="Search architecture articles"
                className="w-full rounded-full border border-[var(--line)] bg-[var(--surface)] py-2.5 pl-10 pr-4 font-mono text-xs text-[var(--page-text)] placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Featured Spotlight Article */}
        {heroPost ? (
          <div className="space-y-10">
            <SpotlightCard className="overflow-hidden border-[var(--acid)]/35 p-0 shadow-[0_30px_80px_var(--shadow)]">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <Link
                  href={`/blog/${heroPost.slug}`}
                  className="relative min-h-[260px] overflow-hidden border-b border-[var(--line)] bg-[#07080d] lg:col-span-5 lg:min-h-[380px] lg:border-b-0 lg:border-r"
                >
                  <Image
                    src={heroPost.coverImage}
                    alt={heroPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-full border border-[#c8ff3d]/40 bg-[#08090e]/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#c8ff3d]">
                      Featured Architecture Case Study
                    </span>
                    <span className="rounded-full bg-black/80 px-2.5 py-1 font-mono text-[10px] text-white/80">
                      {heroPost.readingTimeMinutes} min read
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                  <div>
                    <div className="mb-2.5 flex flex-wrap items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--acid)]">
                      <span>{heroPost.category}</span>
                      <span>•</span>
                      <span className="text-[var(--text-faint)]">
                        Updated {new Date(heroPost.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <Link href={`/blog/${heroPost.slug}`}>
                      <h2 className="m-0 text-[clamp(22px,2.6vw,34px)] font-extrabold leading-[1.18] tracking-[-0.03em] text-[var(--page-text)] transition-colors hover:text-[var(--acid)]">
                        {heroPost.title}
                      </h2>
                    </Link>

                    {/* Highlighted Executive Summary Box */}
                    <div className="mt-4 rounded-2xl border border-[var(--acid)]/30 bg-[var(--acid)]/[0.05] p-4">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>TL;DR — Executive Summary</span>
                      </div>
                      <p className="m-0 text-[13px] leading-[1.68] text-[var(--page-text)]/90">
                        {heroPost.tldrAnswer}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {heroPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-2.5 py-1 font-mono text-[9.5px] text-[var(--text-soft)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-subtle)] pt-4">
                    <div className="flex items-center gap-3 font-mono text-[10.5px] text-[var(--text-faint)]">
                      <span>{heroPost.keyTakeaways.length} Verifiable Metrics</span>
                      <span>•</span>
                      <span>{heroPost.faqs.length} Structured FAQs</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {isAdmin && (
                        <Link
                          href={`/blog/admin?edit=${encodeURIComponent(heroPost.slug)}`}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--acid)]/45 bg-[var(--acid)]/10 px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608]"
                        >
                          <span>Edit Post</span>
                        </Link>
                      )}
                      <Link
                        href={`/blog/${heroPost.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-5 py-2.5 font-mono text-[10.5px] font-black uppercase tracking-[0.12em] text-[#060608]"
                      >
                        <span>Read Full Article</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Remaining Articles Grid */}
            {remainingPosts.length > 0 && (
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post) => (
                  <SpotlightCard
                    key={post.slug}
                    className="group flex h-full flex-col justify-between hover:-translate-y-1 hover:border-[var(--acid)]/45"
                  >
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative block aspect-[16/9.5] w-full overflow-hidden border-b border-[var(--line-subtle)] bg-[#07080d]"
                      >
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/25" />
                        <div className="absolute left-3.5 right-3.5 top-3 flex items-center justify-between">
                          <span className="rounded-full border border-white/15 bg-[#08090e]/85 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#c8ff3d]">
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 font-mono text-[9.5px] text-white/80">
                            <Clock className="h-3 w-3 text-[#38bdf8]" />
                            {post.readingTimeMinutes}m
                          </span>
                        </div>
                      </Link>

                      <div className="p-6 pb-4">
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="mb-2.5 text-lg font-extrabold leading-[1.3] tracking-[-0.02em] text-[var(--page-text)] transition-colors group-hover:text-[var(--acid)]">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="m-0 mb-4 line-clamp-3 text-xs leading-[1.65] text-[var(--text-soft)]">
                          {post.tldrAnswer}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-2.5 py-0.5 font-mono text-[9px] text-[var(--text-faint)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--line-subtle)] px-6 py-4">
                      <span className="font-mono text-[10px] text-[var(--text-faint)]">
                        {post.faqs.length} FAQs · {post.keyTakeaways.length} Takeaways
                      </span>
                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <Link
                            href={`/blog/admin?edit=${encodeURIComponent(post.slug)}`}
                            className="font-mono text-[10px] font-bold uppercase text-[var(--cyan)] hover:underline"
                          >
                            Edit
                          </Link>
                        )}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 font-mono text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--acid)]"
                        >
                          <span>Read</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-12 text-center">
            <p className="font-mono text-sm text-[var(--text-soft)]">
              No articles matched &ldquo;{searchQuery}&rdquo;. Try clearing the search filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
