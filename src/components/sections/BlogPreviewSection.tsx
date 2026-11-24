'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Bot, Clock, Database, PlusCircle, Rss, Sparkles } from 'lucide-react';
import { INITIAL_BLOG_POSTS, type BlogPost } from '@/data/blog-seed';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';

interface BlogPreviewSectionProps {
  posts?: BlogPost[];
}

export function BlogPreviewSection({ posts = INITIAL_BLOG_POSTS }: BlogPreviewSectionProps) {
  const featuredPosts = posts.slice(0, 3);

  return (
    <section
      id="blog"
      aria-labelledby="blog-section-title"
      className="relative border-b border-[var(--line)] bg-[var(--surface-card)] px-[clamp(16px,4vw,72px)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        {/* Header Row */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
              <DecryptedText text="05 / Engineering Insights & Case Studies" />
            </div>
            <h2
              id="blog-section-title"
              className="m-0 text-[clamp(34px,5.5vw,82px)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-[var(--page-text)]"
            >
              Architecture{' '}
              <span className="hero-gradient-text font-serif font-normal italic">Journal.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="m-0 max-w-md text-sm leading-relaxed text-[var(--text-soft)] lg:text-right">
              Real-world system architecture notes, production benchmarks, and technical deep-dives
              from building enterprise SaaS, CRM automation, and AI telephony platforms.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--acid)] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#060608] shadow-[0_6px_24px_var(--acid-glow)] transition-transform hover:-translate-y-0.5"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Explore All Articles ({posts.length})</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Featured 3 Articles Grid */}
        <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <SpotlightCard
              key={post.slug}
              className="group flex h-full flex-col justify-between hover:-translate-y-1.5 hover:border-[var(--acid)]/50 hover:shadow-[0_26px_65px_var(--shadow)]"
            >
              <div>
                {/* Cover Thumbnail */}
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
                  <div className="absolute left-4 right-4 top-3.5 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-white/15 bg-[#08090e]/85 px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#c8ff3d] backdrop-blur-md">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#08090e]/80 px-2.5 py-1 font-mono text-[9.5px] text-white/80 backdrop-blur-md">
                      <Clock className="h-3 w-3 text-[#38bdf8]" />
                      {post.readingTimeMinutes} min
                    </span>
                  </div>
                </Link>

                {/* Article Content */}
                <div className="p-6 pb-4">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="mb-3 text-[19px] font-extrabold leading-[1.28] tracking-[-0.02em] text-[var(--page-text)] transition-colors group-hover:text-[var(--acid)]">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Executive Summary Preview */}
                  <div className="mb-4 rounded-2xl border border-[var(--acid)]/20 bg-[var(--acid)]/[0.04] p-3.5">
                    <div className="mb-1 flex items-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                      <Sparkles className="h-3 w-3" />
                      <span>Executive Summary</span>
                    </div>
                    <p className="m-0 line-clamp-3 text-xs leading-[1.6] text-[var(--text-soft)]">
                      {post.tldrAnswer}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-[var(--text-faint)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[var(--line-subtle)] px-6 py-4">
                <span className="font-mono text-[10px] text-[var(--text-faint)]">
                  {post.readingTimeMinutes} min read · {post.keyTakeaways.length} Key Takeaways
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 font-mono text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--acid)] transition-transform group-hover:translate-x-1"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
