'use client';

import { useState } from 'react';
import { Bot, Check, Copy, FileCode2, Share2 } from 'lucide-react';

interface ArticleActionsBarProps {
  title: string;
  slug: string;
  canonicalUrl: string;
  tldrAnswer: string;
  authorName: string;
}

export function ArticleActionsBar({
  title,
  slug,
  canonicalUrl,
  tldrAnswer,
  authorName,
}: ArticleActionsBarProps) {
  const [copiedType, setCopiedType] = useState<'cite' | 'url' | null>(null);

  const handleCopyCitation = async () => {
    const citation = `${authorName} (2026). "${title}." Haris Khan Durrani Architecture Journal. ${canonicalUrl} — Summary: ${tldrAnswer}`;
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedType('cite');
      window.setTimeout(() => setCopiedType(null), 2200);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopiedType('url');
      window.setTimeout(() => setCopiedType(null), 2200);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={handleCopyCitation}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--acid)]/40 bg-[var(--acid)]/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--acid)] transition-colors hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
      >
        {copiedType === 'cite' ? <Check className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
        <span>{copiedType === 'cite' ? 'AI Citation Copied!' : 'Cite for AI / LLM'}</span>
      </button>

      <a
        href={`/api/blog/${slug}?format=md`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--cyan)] transition-colors hover:border-[var(--cyan)]"
      >
        <FileCode2 className="h-3.5 w-3.5" />
        <span>Raw Markdown (.MD)</span>
      </a>

      <button
        type="button"
        onClick={handleCopyUrl}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-soft)] transition-colors hover:border-[var(--acid)] hover:text-[var(--page-text)] cursor-pointer"
      >
        {copiedType === 'url' ? <Check className="h-3.5 w-3.5 text-[var(--acid)]" /> : <Share2 className="h-3.5 w-3.5" />}
        <span>{copiedType === 'url' ? 'Link Copied!' : 'Copy Link'}</span>
      </button>

      <a
        href="/llms-full.txt"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[10px] text-[var(--text-faint)] hover:text-[var(--page-text)]"
      >
        <Copy className="h-3 w-3" />
        <span>llms-full.txt</span>
      </a>
    </div>
  );
}
