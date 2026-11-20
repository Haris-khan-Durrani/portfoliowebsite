'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ExternalLink, Github, X } from 'lucide-react';
import type { ProjectItem } from '@/data/portfolio';

interface BlueprintModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function BlueprintModal({ project, onClose }: BlueprintModalProps) {
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-5"
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92svh] w-full max-w-[1040px] flex-col overflow-hidden rounded-t-[26px] border border-[var(--header-border)] bg-[var(--surface-card)] shadow-[0_40px_120px_rgba(0,0,0,0.8)] sm:max-h-[90vh] sm:rounded-[26px]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-5 sm:px-9 sm:py-7">
              <div className="min-w-0">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                  {project.blueprint.category}
                </span>
                <h2
                  id="modalTitle"
                  className="mt-1.5 text-[clamp(22px,3.4vw,42px)] font-black uppercase leading-[1.05] tracking-[-0.04em] text-[var(--page-text)]"
                >
                  {project.blueprint.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close system blueprint dialog"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--page-text)] transition-colors hover:border-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-9 sm:py-8">
              {/* Role + Action Banner */}
              <div className="mb-7 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#08090e] p-5 text-white md:flex-row md:items-center">
                <div>
                  <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#c8ff3d]">
                    ENGINEERING ROLE
                  </div>
                  <p className="m-0 text-sm font-medium text-white/90">{project.blueprint.role}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#c8ff3d] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#060608] transition-transform hover:-translate-y-0.5"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Visit Live System</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:border-[#c8ff3d] hover:text-[#c8ff3d]"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>View Source Code</span>
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/75 transition-colors hover:border-[#38bdf8] hover:text-[#38bdf8]"
                  >
                    <span>Dedicated Page</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* High-Res Interface Visual if available */}
              {project.image && (
                <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[#07080d]">
                  <Image
                    src={project.image}
                    alt={`${project.blueprint.title} architecture screen`}
                    fill
                    sizes="(max-width: 1040px) 100vw, 960px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Two-Column Blueprint Details */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-7">
                  <div>
                    <h3 className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                      01 / The Architectural Problem
                    </h3>
                    <p className="m-0 text-[13.5px] leading-[1.7] text-[var(--text-soft)]">
                      {project.blueprint.problem}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                      02 / System Flow &amp; Lifecycle
                    </h3>
                    <ul className="m-0 list-disc space-y-2 pl-5 text-[13.5px] leading-[1.65] text-[var(--text-soft)]">
                      {project.blueprint.flow.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-7">
                  <div>
                    <h3 className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                      03 / Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.blueprint.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-soft)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                      04 / Engineering Decisions &amp; Tradeoffs
                    </h3>
                    <ul className="m-0 list-disc space-y-2 pl-5 text-[13.5px] leading-[1.65] text-[var(--text-soft)]">
                      {project.blueprint.decisions.map((decision, idx) => (
                        <li key={idx}>{decision}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-[var(--acid)]/30 bg-[var(--acid)]/[0.06] p-4">
                    <h3 className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                      05 / Measurable Production Value
                    </h3>
                    <p className="m-0 text-[13.5px] font-semibold leading-[1.65] text-[var(--page-text)]">
                      {project.blueprint.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
