'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowUpRight, FolderOpen, Layers } from 'lucide-react';
import { DOSSIERS, SITE_CONFIG } from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { TiltedCard } from '@/components/reactbits/TiltedCard';
import { cn } from '@/lib/utils';

interface DossiersSectionProps {
  onOpenBlueprint: (projectId: string) => void;
}

export function DossiersSection({ onOpenBlueprint }: DossiersSectionProps) {
  const [folderOpen, setFolderOpen] = useState(true);

  return (
    <section
      id="dossiers"
      aria-labelledby="folder-title"
      className="relative border-b border-[var(--line)] bg-[var(--page-bg)] px-[clamp(16px,4vw,72px)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
              <DecryptedText text="02 / React Bits · Tactile Folder Deck" />
            </div>
            <h2
              id="folder-title"
              className="m-0 text-[clamp(34px,5.6vw,84px)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-[var(--page-text)]"
            >
              Architectural Dossiers.
            </h2>
          </div>
          <p className="m-0 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
            {SITE_CONFIG.dossiersIntro}
          </p>
        </div>

        <div className="relative mx-auto mt-12 rounded-[30px] border border-[var(--line)] bg-[var(--surface-card)] p-5 shadow-[0_35px_90px_var(--shadow)] sm:p-8 lg:p-12">
          {/* Interactive Folder Header Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--acid)]/35 bg-[var(--acid)]/[0.09] px-4 py-1.5 font-mono text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
                EBMS GROUP PLATFORMS &amp; SAAS ARCHITECTURES
              </span>
              <button
                type="button"
                onClick={() => setFolderOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-[var(--page-text)] transition-colors hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
              >
                {folderOpen ? (
                  <>
                    <Layers className="h-3.5 w-3.5 text-[var(--acid)]" />
                    <span>Stack Folder</span>
                  </>
                ) : (
                  <>
                    <FolderOpen className="h-3.5 w-3.5 text-[var(--acid)]" />
                    <span>Fan Out Dossiers</span>
                  </>
                )}
              </button>
            </div>
            <span className="font-mono text-[11px] text-[var(--text-faint)]">
              Select any dossier to open full blueprint modal ↗
            </span>
          </div>

          {/* React Bits Tactile 3D Folder Preview / Fanning Deck */}
          {!folderOpen ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <motion.button
                type="button"
                onClick={() => setFolderOpen(true)}
                whileHover={{ scale: 1.05, y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex h-56 w-72 flex-col items-center justify-end rounded-[26px] border border-[var(--acid)]/40 bg-gradient-to-b from-[#171b26] to-[#0c0e15] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.65)] cursor-pointer"
              >
                {/* Stacked peeking paper cards */}
                <span className="absolute -top-6 left-7 right-7 h-20 -rotate-6 rounded-xl border border-white/15 bg-[#111521] transition-transform duration-300 group-hover:-translate-y-4 group-hover:-rotate-12" />
                <span className="absolute -top-8 left-9 right-9 h-20 rotate-6 rounded-xl border border-[var(--cyan)]/35 bg-[#141a29] transition-transform duration-300 group-hover:-translate-y-5 group-hover:rotate-12" />
                <span className="absolute -top-10 left-11 right-11 h-20 rounded-xl border border-[var(--acid)]/50 bg-[#182026] transition-transform duration-300 group-hover:-translate-y-7" />

                {/* Front folder pocket */}
                <div className="relative z-10 flex w-full flex-col items-center rounded-2xl border border-white/10 bg-[#0d1018]/95 px-4 py-5 backdrop-blur-md">
                  <FolderOpen className="mb-2 h-8 w-8 text-[var(--acid)]" />
                  <span className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-white">
                    4 Enterprise Dossiers
                  </span>
                  <span className="mt-1 font-mono text-[10px] text-white/55">
                    Click to fan out blueprints ↗
                  </span>
                </div>
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {DOSSIERS.map((dossier, idx) => (
                <motion.div
                  key={dossier.id}
                  initial={{ opacity: 0, y: 24, rotate: idx % 2 === 0 ? -1.5 : 1.5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 22,
                    delay: idx * 0.06,
                  }}
                >
                  <TiltedCard maxTilt={6}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onOpenBlueprint(dossier.caseKey)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onOpenBlueprint(dossier.caseKey);
                        }
                      }}
                      className={cn(
                        'group flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_16px_40px_var(--shadow)] transition-all duration-300 hover:-translate-y-2 hover:border-[var(--acid)] hover:shadow-[0_26px_64px_rgba(200,255,61,0.14)]'
                      )}
                    >
                      <div>
                        {/* Visual Dossier Thumbnail */}
                        {dossier.image && (
                          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--line-subtle)] bg-[#07080d]">
                            <Image
                              src={dossier.image}
                              alt={`${dossier.title} interface mockup`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/80 via-transparent to-transparent" />
                            <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-[#08090e]/85 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#c8ff3d] backdrop-blur-md">
                              {dossier.badge}
                            </span>
                          </div>
                        )}

                        <div className="p-6 pb-4">
                          <span className="mb-2.5 block font-mono text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--acid)]">
                            {dossier.tag}
                          </span>
                          <h3 className="mb-3 text-[19px] font-black uppercase leading-[1.15] tracking-[-0.03em] text-[var(--page-text)]">
                            {dossier.title}
                          </h3>
                          <p className="m-0 text-[13px] leading-[1.62] text-[var(--text-soft)]">
                            {dossier.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-[var(--line-subtle)] px-6 py-4">
                        <span className="font-mono text-[10px] text-[var(--text-faint)]">
                          {dossier.stackLabel}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--acid)] transition-transform group-hover:translate-x-1">
                          Blueprint
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </TiltedCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
