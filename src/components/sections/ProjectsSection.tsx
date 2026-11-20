'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ExternalLink, Github, Lock, Star } from 'lucide-react';
import {
  PROJECT_FILTERS,
  PROJECTS,
  SITE_CONFIG,
  type ProjectCategory,
} from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { cn } from '@/lib/utils';

interface ProjectsSectionProps {
  onOpenBlueprint: (projectId: string) => void;
}

export function ProjectsSection({ onOpenBlueprint }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const filteredProjects =
    activeFilter === 'all'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeFilter);

  return (
    <section
      id="work"
      aria-labelledby="projects-title"
      className="relative border-b border-[var(--line)] bg-[var(--page-bg)] px-[clamp(16px,4vw,72px)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
              <DecryptedText text="04 / Systems & Repositories" />
            </div>
            <h2
              id="projects-title"
              className="m-0 text-[clamp(34px,5.6vw,84px)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-[var(--page-text)]"
            >
              Architected &amp; Shipped.
            </h2>
          </div>
          <p className="m-0 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
            {SITE_CONFIG.projectsIntro}
          </p>
        </div>

        {/* Animate UI Gliding Filter Bar */}
        <div
          id="projectFilterBar"
          role="tablist"
          aria-label="Filter production systems by category"
          className="my-10 flex flex-wrap items-center gap-2.5 sm:my-12"
        >
          {PROJECT_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  'relative rounded-full border px-4 py-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] transition-colors cursor-pointer sm:px-5',
                  isActive
                    ? 'border-[var(--acid)] text-[#060608]'
                    : 'border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)] hover:border-[var(--acid)]/60 hover:text-[var(--page-text)]'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-filter-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-[var(--acid)] shadow-[0_4px_20px_var(--acid-glow)]"
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid (12 Production Systems) */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <SpotlightCard className="group flex h-full flex-col justify-between hover:-translate-y-1 hover:border-[var(--acid)]/45 hover:shadow-[0_24px_64px_var(--shadow)]">
                  <div>
                    {/* Optional High-Res UI Mockup Preview Banner */}
                    {project.image && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--line-subtle)] bg-[#07080d]">
                        <Image
                          src={project.image}
                          alt={`${project.title} production interface`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/15" />
                        <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between gap-2">
                          <span className="rounded-full border border-white/15 bg-[#08090e]/85 px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#c8ff3d] backdrop-blur-md">
                            {project.previewHeaderTag}
                          </span>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="rounded-full border border-white/15 bg-[#08090e]/80 px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-white/80 backdrop-blur-md transition-colors hover:border-[#c8ff3d] hover:text-[#c8ff3d]"
                          >
                            Case Page ↗
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Header & Metadata */}
                    <div className="p-6 pb-4 sm:p-8 sm:pb-4">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                          {project.categoryLabel}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--text-faint)]">
                          <Star className="h-3 w-3 fill-[var(--acid)] text-[var(--acid)]" />
                          {project.starsLabel}
                        </span>
                      </div>

                      <h3 className="mb-3 text-[clamp(22px,2.3vw,32px)] font-black uppercase leading-[1.06] tracking-[-0.04em] text-[var(--page-text)]">
                        {project.title}
                      </h3>

                      <p className="m-0 text-[13.5px] leading-[1.65] text-[var(--text-soft)]">
                        {project.summary}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Live Architecture Telemetry Preview Box */}
                    <div className="mx-5 mb-5 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#08090e] p-4 font-mono text-[11px] sm:mx-7">
                      <div className="mb-2.5 flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2 text-[10px] text-white/45">
                        <span className="truncate">{project.previewHeaderLeft}</span>
                        <span className="shrink-0 rounded bg-[#c8ff3d]/15 px-2 py-0.5 font-bold text-[#c8ff3d]">
                          {project.previewHeaderTag}
                        </span>
                      </div>
                      <div className="space-y-1 leading-relaxed">
                        {project.previewLines.map((line, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              line.tone === 'bright' && 'text-white/85',
                              line.tone === 'acid' && 'text-[#c8ff3d]',
                              line.tone === 'muted' && 'text-white/55'
                            )}
                          >
                            {line.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line-subtle)] px-6 py-4 sm:px-8 sm:py-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onOpenBlueprint(project.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#060608] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--acid-glow)] cursor-pointer"
                      >
                        <span>System Blueprint</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>

                      {!project.image && (
                        <Link
                          href={`/projects/${project.slug}`}
                          className="rounded-full border border-[var(--line)] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-soft)] transition-colors hover:border-[var(--acid)] hover:text-[var(--acid)]"
                        >
                          Full Spec
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--text-soft)] transition-colors hover:text-[var(--acid)]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>{project.liveLabel} ↗</span>
                        </a>
                      )}

                      {!project.liveUrl && project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--text-soft)] transition-colors hover:text-[var(--acid)]"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>{project.githubLabel || 'GitHub Repo'} ↗</span>
                        </a>
                      )}

                      {!project.liveUrl && !project.githubUrl && project.privateLabel && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-faint)]">
                          <Lock className="h-3 w-3" />
                          {project.privateLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
