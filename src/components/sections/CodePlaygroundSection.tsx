'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { CODE_SNIPPETS, SITE_CONFIG, type CodeSnippetItem } from '@/data/portfolio';
import { DecryptedText } from '@/components/reactbits/DecryptedText';
import { CopyButton } from '@/components/animate-ui/CopyButton';
import { cn } from '@/lib/utils';

interface CodePlaygroundSectionProps {
  onShowToast: (message: string) => void;
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'class',
  'const',
  'let',
  'var',
  'function',
  'async',
  'await',
  'return',
  'new',
  'if',
  'constructor',
]);

const TYPES_AND_CLASSES = new Set([
  'CallControlClient',
  'WebSocket',
  'AutoDialerEngine',
  'GHLClient',
  'S3Client',
  'PutObjectCommand',
  'Router',
  'Request',
  'Response',
  'DBConfig',
  'S3Target',
]);

function highlightCodeLine(line: string): ReactNode[] {
  const commentIndex = line.indexOf('//');
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : '';

  const nodes: ReactNode[] = [];
  const tokenRegex = /('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|`(?:\\`|[^`])*`|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(codePart)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(codePart.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
      nodes.push(
        <span key={`s-${keyCounter++}`} className="text-amber-200">
          {token}
        </span>
      );
    } else if (KEYWORDS.has(token)) {
      nodes.push(
        <span key={`k-${keyCounter++}`} className="font-bold text-[#c8ff3d]">
          {token}
        </span>
      );
    } else if (TYPES_AND_CLASSES.has(token)) {
      nodes.push(
        <span key={`t-${keyCounter++}`} className="text-[#38bdf8]">
          {token}
        </span>
      );
    } else {
      nodes.push(token);
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < codePart.length) {
    nodes.push(codePart.slice(lastIndex));
  }

  if (commentPart) {
    nodes.push(
      <span key="comment" className="italic text-white/40">
        {commentPart}
      </span>
    );
  }

  return nodes;
}

export function CodePlaygroundSection({ onShowToast }: CodePlaygroundSectionProps) {
  const [activeId, setActiveId] = useState<CodeSnippetItem['id']>('telephony');
  const activeSnippet = CODE_SNIPPETS.find((s) => s.id === activeId) || CODE_SNIPPETS[0];
  const lines = activeSnippet.code.split('\n');

  return (
    <section
      id="codeplay"
      aria-labelledby="codeplay-title"
      className="relative border-b border-[var(--line)] bg-[var(--surface-card)] px-[clamp(16px,4vw,72px)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--acid)]">
              <DecryptedText text="03 / Animate UI · Single-Accent Code Inspector" />
            </div>
            <h2
              id="codeplay-title"
              className="m-0 text-[clamp(34px,5.6vw,84px)] font-black uppercase leading-[0.9] tracking-[-0.055em] text-[var(--page-text)]"
            >
              Production Code.
            </h2>
          </div>
          <p className="m-0 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
            {SITE_CONFIG.codeIntro}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1180px] overflow-hidden rounded-[24px] border border-white/15 bg-[#08090e] shadow-[0_35px_90px_rgba(0,0,0,0.68)]">
          {/* Top Tabs Bar with Animate UI Spring Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0f111a] px-4 py-2.5">
            <div
              role="tablist"
              aria-label="Production code snippets"
              className="flex flex-1 items-center gap-1 overflow-x-auto pb-0.5"
            >
              {CODE_SNIPPETS.map((snippet) => {
                const isActive = snippet.id === activeId;
                return (
                  <button
                    key={snippet.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => setActiveId(snippet.id)}
                    className={cn(
                      'relative shrink-0 rounded-lg px-3.5 py-1.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer',
                      isActive ? 'text-[#060608]' : 'text-white/55 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="code-tab-highlight"
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        className="absolute inset-0 rounded-lg bg-[#c8ff3d] shadow-[0_2px_12px_rgba(200,255,61,0.35)]"
                      />
                    )}
                    <span className="relative z-10">{snippet.filename}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#38bdf8] sm:inline-block">
                {activeSnippet.badge}
              </span>
              <CopyButton
                text={activeSnippet.code}
                label="Copy Snippet"
                copiedLabel="Copied! ✓"
                onCopied={() => onShowToast(`Copied ${activeSnippet.filename} to clipboard!`)}
              />
            </div>
          </div>

          {/* Code Body with Smooth AnimatePresence Crossfade */}
          <div className="min-h-[340px] overflow-x-auto p-5 font-mono text-[12px] leading-[1.75] text-slate-200 sm:p-7 sm:text-[12.5px]">
            <AnimatePresence mode="wait">
              <motion.pre
                key={activeSnippet.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="m-0"
              >
                <code>
                  {lines.map((line, index) => (
                    <div key={index} className="table-row hover:bg-white/[0.03]">
                      <span className="table-cell select-none pr-5 text-right text-[11px] text-white/25">
                        {index + 1}
                      </span>
                      <span className="table-cell whitespace-pre">
                        {highlightCodeLine(line)}
                      </span>
                    </div>
                  ))}
                </code>
              </motion.pre>
            </AnimatePresence>
          </div>

          {/* Footer Runtime Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] bg-[#0b0d14] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.06em] text-white/45">
            <span className="inline-flex items-center gap-1.5 text-[#c8ff3d]/90">
              <ShieldCheck className="h-3.5 w-3.5" />
              SYNTAX: VERIFIED FOR PRODUCTION
            </span>
            <span>{activeSnippet.runtimeLabel}</span>
            <span>RUNTIME: NODE.JS v20.x · ENCRYPTED &amp; HMAC SEALED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
