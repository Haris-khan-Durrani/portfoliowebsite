import Link from 'next/link';
import { INITIAL_BLOG_POSTS, type BlogPost } from '@/data/blog-seed';
import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';

interface FooterProps {
  posts?: BlogPost[];
}

export function Footer({ posts = INITIAL_BLOG_POSTS }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-[var(--line)] bg-[var(--surface)] px-[clamp(16px,4vw,72px)] pb-24 pt-10 lg:pb-24">
      <div className="mx-auto max-w-[1360px] space-y-5">
        {/* SEO Indexable System Blueprints Quick Links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--line-subtle)] pb-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-faint)]">
          <span className="font-bold text-[var(--acid)]">System Blueprints:</span>
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-[var(--page-text)]"
            >
              {project.shortTitle}
            </Link>
          ))}
        </div>

        {/* SEO / AEO / GEO Blog Articles Quick Links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--line-subtle)] pb-4 font-mono text-[10px] tracking-[0.06em] text-[var(--text-faint)]">
          <Link href="/blog" className="font-bold uppercase text-[var(--cyan)] hover:underline">
            Architecture Journal (SEO · AEO · GEO):
          </Link>
          {posts.slice(0, 8).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="transition-colors hover:text-[var(--page-text)]"
            >
              {post.category}
            </Link>
          ))}
        </div>

        {/* Core Footer Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
          <div>
            <strong className="text-[var(--page-text)]">{SITE_CONFIG.name}</strong> · Dubai, UAE ·{' '}
            {SITE_CONFIG.phone}
          </div>
          <div>Head of IT · Solution Architecture · Full-Stack Systems · Telephony · DevOps</div>
          <div className="flex flex-wrap items-center gap-3.5">
            <span>&copy; 2026 {SITE_CONFIG.domain}</span>
            <Link href="/blog" className="text-[var(--acid)] hover:underline">
              Blog
            </Link>
            <a href="/sitemap.xml" className="text-[var(--acid)] hover:underline">
              Sitemap.xml
            </a>
            <a href="/rss.xml" className="text-[var(--cyan)] hover:underline">
              RSS.xml
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
