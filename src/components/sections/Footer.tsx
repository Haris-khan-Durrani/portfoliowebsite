import Link from 'next/link';
import { PROJECTS, SITE_CONFIG } from '@/data/portfolio';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--line)] bg-[var(--surface)] px-[clamp(16px,4vw,72px)] pb-24 pt-10 lg:pb-24">
      <div className="mx-auto max-w-[1360px] space-y-6">
        {/* SEO Indexable Blueprint Quick Links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--line-subtle)] pb-5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-faint)]">
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

        {/* Core Footer Row from index.backup.html */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
          <div>
            <strong className="text-[var(--page-text)]">{SITE_CONFIG.name}</strong> · Dubai, UAE ·{' '}
            {SITE_CONFIG.phone}
          </div>
          <div>Head of IT · Solution Architecture · Full-Stack Systems · Telephony · DevOps</div>
          <div>&copy; 2026 All Rights Reserved · {SITE_CONFIG.domain}</div>
        </div>
      </div>
    </footer>
  );
}
