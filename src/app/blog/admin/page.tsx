'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Edit3,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { BlogFaqItem, BlogPost } from '@/data/blog-seed';

export default function BlogAdminStudioPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [storageInfo, setStorageInfo] = useState<{
    engine: string;
    connected: boolean;
    database: string;
  }>({ engine: 'mysql', connected: false, database: 'hkd_portfolio' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('CRM & Automation Architecture');
  const [coverImage, setCoverImage] = useState('/assets/portal.jpg');
  const [excerpt, setExcerpt] = useState('');
  const [tldrAnswer, setTldrAnswer] = useState('');
  const [tagsInput, setTagsInput] = useState(
    'GoHighLevel API v2, Node.js, MySQL, Multi-Tenant SaaS, Dubai IT'
  );
  const [entitiesInput, setEntitiesInput] = useState(
    'Haris Khan Durrani, EBMS Business Services, Dubai Enterprise Architecture'
  );
  const [takeawaysInput, setTakeawaysInput] = useState(
    'Reduced duplicate SaaS licensing overhead by 80% across 9 sister companies.\nUnified 105 internal users onto a single white-label OAuth 2.0 foundation.\nAchieved sub-250ms real-time webhook synchronization with HMAC-SHA256 verification.'
  );
  const [content, setContent] = useState(
    '## Architectural Context\n\nExplain the enterprise bottleneck and system constraints...\n\n## Core Implementation\n\n```typescript\n// Production implementation snippet\nexport async function syncTenantPipeline(tenantId: string) {\n  return { status: "VERIFIED", tenantId };\n}\n```\n\n## Production Outcome\n\nSummarize measurable latency, reliability, and cost improvements.'
  );
  const [faqs, setFaqs] = useState<BlogFaqItem[]>([
    {
      question: 'How does this architecture enforce strict multi-tenant isolation?',
      answer:
        'Every request is authenticated with signed JWT claims and scoped by tenant_id at the MySQL / ORM query boundary.',
    },
    {
      question: 'What is the measurable production ROI of this system?',
      answer:
        'It eliminated repetitive manual workflows and reduced duplicate SaaS tooling spend by 80% across participating business units.',
    },
  ]);
  const [featured, setFeatured] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog?drafts=1');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        if (data.storage) setStorageInfo(data.storage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  // Live SEO / AEO / GEO Readiness Score Calculator
  const liveScore = useMemo(() => {
    const tldrWords = tldrAnswer.trim().split(/\s+/).filter(Boolean).length;
    const contentWords = content.trim().split(/\s+/).filter(Boolean).length;
    const tagsList = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const takeawaysList = takeawaysInput
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());

    const checks = [
      {
        pillar: 'SEO',
        label: 'Descriptive Title (35+ chars) & clean slug',
        passed: title.trim().length >= 35,
      },
      {
        pillar: 'SEO',
        label: 'Excerpt (90+ chars) & 4+ technical tags',
        passed: excerpt.trim().length >= 90 && tagsList.length >= 4,
      },
      {
        pillar: 'AEO',
        label: `TL;DR Direct Answer (${tldrWords} words — target 30–95 words for Featured Snippets)`,
        passed: tldrWords >= 30 && tldrWords <= 95,
      },
      {
        pillar: 'AEO',
        label: `Structured FAQPage Q&As (${validFaqs.length} pairs — target 2+)`,
        passed: validFaqs.length >= 2,
      },
      {
        pillar: 'GEO',
        label: `Verifiable Quantitative Takeaways (${takeawaysList.length} bullets — target 3+)`,
        passed: takeawaysList.length >= 3,
      },
      {
        pillar: 'GEO',
        label: `Technical depth (${contentWords} words) & Knowledge Graph entities`,
        passed: contentWords >= 80 && entitiesInput.split(',').filter(Boolean).length >= 2,
      },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const total = Math.round((passedCount / checks.length) * 100);
    return { total, checks };
  }, [title, excerpt, tldrAnswer, tagsInput, takeawaysInput, faqs, content, entitiesInput]);

  const handleLoadPostForEdit = (post: BlogPost) => {
    setTitle(post.title);
    setSlug(post.slug);
    setSubtitle(post.subtitle);
    setCategory(post.category);
    setCoverImage(post.coverImage);
    setExcerpt(post.excerpt);
    setTldrAnswer(post.tldrAnswer);
    setTagsInput(post.tags.join(', '));
    setEntitiesInput(post.geoEntities.join(', '));
    setTakeawaysInput(post.keyTakeaways.join('\n'));
    setContent(post.content);
    setFaqs(post.faqs.length > 0 ? post.faqs : [{ question: '', answer: '' }]);
    setFeatured(post.featured);
    setStatusMsg({ ok: true, text: `Loaded "${post.title}" into editor.` });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          subtitle,
          category,
          coverImage,
          excerpt,
          tldrAnswer,
          tags: tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          geoEntities: entitiesInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          keyTakeaways: takeawaysInput
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean),
          content,
          faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
          featured,
          published: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          ok: true,
          text: `Saved & indexed "${data.post.title}" (${data.engine === 'mysql' ? 'MySQL Database' : 'Hybrid JSON Store'}) — SEO/AEO/GEO Score: ${data.score.total}/100!`,
        });
        await fetchPosts();
      } else {
        setStatusMsg({ ok: false, text: data.error || 'Failed to save article.' });
      }
    } catch {
      setStatusMsg({ ok: false, text: 'Network error while saving article.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (targetSlug: string) => {
    await fetch(`/api/blog/${targetSlug}`, { method: 'DELETE' });
    setStatusMsg({ ok: true, text: `Removed article "${targetSlug}".` });
    await fetchPosts();
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="arch-grid-bg" aria-hidden="true" />

      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--page-text)] hover:text-[var(--acid)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
              <span>Back to Blog</span>
            </Link>
            <span className="text-[var(--line)]">/</span>
            <span className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
              MySQL Blog &amp; SEO · AEO · GEO Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 font-mono text-[10.5px] text-[var(--text-soft)]">
              <Database className="h-3.5 w-3.5 text-[var(--acid)]" />
              <span>
                Storage:{' '}
                <strong className="text-[var(--acid)]">
                  {storageInfo.engine === 'mysql'
                    ? `MySQL (${storageInfo.database})`
                    : 'MySQL Ready (Hybrid Auto-Fallback)'}
                </strong>
              </span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1320px] px-5 py-10 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left: Article Editor Form (8 cols) */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8 lg:col-span-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                  PUBLISHING ENGINE
                </span>
                <h1 className="m-0 text-2xl font-extrabold tracking-[-0.03em]">
                  Create or Update SEO / AEO / GEO Article
                </h1>
              </div>

              <label className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-soft)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[#c8ff3d]"
                />
                <span>Feature at Top</span>
              </label>
            </div>

            {statusMsg && (
              <div
                className={`rounded-2xl border p-4 font-mono text-xs ${
                  statusMsg.ok
                    ? 'border-[var(--acid)]/45 bg-[var(--acid)]/10 text-[var(--acid)]'
                    : 'border-red-500/40 bg-red-500/10 text-red-300'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  Article Headline (H1 &amp; SEO Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to Architect a Multi-Tenant GoHighLevel OAuth 2.0 CRM Portal..."
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  URL Slug (auto-generated if blank)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="multi-tenant-ghl-oauth2-dubai"
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 font-mono text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  Cover Image Path
                </label>
                <select
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 font-mono text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                >
                  <option value="/assets/portal.jpg">/assets/portal.jpg (EBMS Portal)</option>
                  <option value="/assets/proposal.jpg">/assets/proposal.jpg (Proposal Engine)</option>
                  <option value="/assets/dialer.jpg">/assets/dialer.jpg (3CX AI Dialer)</option>
                  <option value="/assets/school.jpg">/assets/school.jpg (School ERP)</option>
                  <option value="/assets/tablehub.jpg">/assets/tablehub.jpg (TableHub SaaS)</option>
                  <option value="/assets/pgvault.jpg">/assets/pgvault.jpg (PGVault Core)</option>
                  <option value="/assets/nexus.jpg">/assets/nexus.jpg (Nexus 3D)</option>
                  <option value="/assets/hammam.jpg">/assets/hammam.jpg (Home of Hammam)</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Secondary architectural context..."
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                SEO Meta Description / Excerpt (110–260 chars) *
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Concise summary for search results and social preview cards..."
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
              />
            </div>

            {/* AEO Direct Answer Box */}
            <div className="rounded-2xl border border-[var(--acid)]/40 bg-[var(--acid)]/[0.05] p-4">
              <label className="mb-1.5 flex items-center gap-1.5 font-mono text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  AEO TL;DR Direct Answer (40–75 words for Featured Snippets, Voice &amp; AI
                  Overviews) *
                </span>
              </label>
              <textarea
                rows={3}
                required
                value={tldrAnswer}
                onChange={(e) => setTldrAnswer(e.target.value)}
                placeholder="Write a direct, self-contained 40–75 word answer starting with how/why the architecture works and the measurable outcome..."
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 text-xs leading-relaxed text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
              />
            </div>

            {/* GEO Verifiable Takeaways */}
            <div>
              <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--cyan)]">
                GEO Quantitative Key Takeaways (One verifiable fact per line — LLMs cite concrete
                metrics)
              </label>
              <textarea
                rows={3}
                value={takeawaysInput}
                onChange={(e) => setTakeawaysInput(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 font-mono text-xs leading-relaxed text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  Topic Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 font-mono text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--cyan)]">
                  GEO Knowledge Graph Entities (comma-separated)
                </label>
                <input
                  type="text"
                  value={entitiesInput}
                  onChange={(e) => setEntitiesInput(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 font-mono text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
              </div>
            </div>

            {/* Markdown Content */}
            <div>
              <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                Article Body (Markdown with ## H2, ### H3 &amp; ```code blocks) *
              </label>
              <textarea
                rows={10}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-4 font-mono text-xs leading-relaxed text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
              />
            </div>

            {/* AEO FAQPage Builder */}
            <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  AEO FAQPage Schema Builder (Auto-generates JSON-LD Q&amp;A Rich Results)
                </span>
                <button
                  type="button"
                  onClick={() => setFaqs((prev) => [...prev, { question: '', answer: '' }])}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--acid)]/40 px-3 py-1 font-mono text-[10px] font-bold text-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {faqs.map((faq, idx) => (
                <div key={idx} className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFaqs((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, question: val } : item))
                      );
                    }}
                    placeholder={`Question #${idx + 1} (e.g. How do you prevent OAuth token race conditions?)`}
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2 text-xs font-bold text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFaqs((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, answer: val } : item))
                      );
                    }}
                    placeholder="Direct authoritative technical answer..."
                    className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2 text-xs text-[var(--text-soft)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--acid)] py-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#060608] shadow-[0_10px_30px_var(--acid-glow)] transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving & Indexing...' : 'Publish & Index Article (MySQL + SEO/AEO/GEO)'}</span>
            </button>
          </form>

          {/* Right: Live SEO / AEO / GEO Analyzer & Existing Articles List (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Live Readiness Score Card */}
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                  Live SEO · AEO · GEO Readiness
                </span>
                <span className="font-mono text-lg font-black text-[var(--acid)]">
                  {liveScore.total}/100
                </span>
              </div>

              <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-card)]">
                <div
                  className="h-full bg-gradient-to-r from-[var(--acid)] to-[var(--cyan)] transition-all duration-300"
                  style={{ width: `${liveScore.total}%` }}
                />
              </div>

              <ul className="m-0 space-y-2.5 pl-0 list-none text-xs">
                {liveScore.checks.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        c.passed ? 'text-[var(--acid)]' : 'text-white/20'
                      }`}
                    />
                    <span className={c.passed ? 'text-[var(--page-text)]' : 'text-[var(--text-faint)]'}>
                      <strong className="font-mono text-[10px]">[{c.pillar}]</strong> {c.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Existing Articles List */}
            <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6">
              <div className="mb-4 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                Published Articles ({posts.length})
              </div>

              {loading ? (
                <p className="font-mono text-xs text-[var(--text-faint)]">Loading articles...</p>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.slug}
                      className="rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-3.5"
                    >
                      <div className="mb-1 font-mono text-[9.5px] uppercase text-[var(--acid)]">
                        {post.category}
                      </div>
                      <div className="mb-2.5 line-clamp-2 text-xs font-extrabold text-[var(--page-text)]">
                        {post.title}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLoadPostForEdit(post)}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(post.slug)}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-[10px] text-red-400 hover:border-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[var(--acid)]"
                        >
                          <span>View</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
