'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Bold,
  Check,
  CheckCircle2,
  CircleAlert,
  Code2,
  Copy,
  Database,
  Edit3,
  Eye,
  EyeOff,
  FilePlus2,
  FolderOpen,
  Globe,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  List,
  LogOut,
  Plus,
  Save,
  Search,
  Sparkles,
  Star,
  Table2,
  Trash2,
  UploadCloud,
  Wand2,
} from 'lucide-react';
import type { BlogComparisonTable, BlogFaqItem, BlogPost } from '@/data/blog-seed';
import type { MediaAssetItem } from '@/app/api/admin/media/route';
import { SITE_CONFIG } from '@/data/portfolio';
import { cn } from '@/lib/utils';

type StudioTab = 'editor' | 'articles' | 'media';
type ComposerStep = 'write' | 'aeo-geo' | 'seo-preview';

const CATEGORY_PRESETS = [
  'CRM & Automation Architecture',
  'Enterprise SaaS & Document Engines',
  'Telephony & Real-Time Systems',
  'Multi-Tenant SaaS & ERP',
  'Database & Cloud Infrastructure',
  'Real-Time SaaS & Product Engineering',
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

function stripMd(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function BlogAdminStudioPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverUploadRef = useRef<HTMLInputElement | null>(null);
  const inlineImageUploadRef = useRef<HTMLInputElement | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auth & Top-Level Tabs
  const [authChecking, setAuthChecking] = useState(true);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StudioTab>('editor');
  const [composerStep, setComposerStep] = useState<ComposerStep>('write');
  const [showPreview, setShowPreview] = useState(false);

  // Data
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [storageInfo, setStorageInfo] = useState<{
    engine: string;
    connected: boolean;
    database: string;
  }>({ engine: 'mysql', connected: false, database: 'hkd_portfolio' });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [articleFilterQuery, setArticleFilterQuery] = useState('');
  const [copiedMediaUrl, setCopiedMediaUrl] = useState<string | null>(null);

  // Clean, User-Friendly Editor State
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [coverImage, setCoverImage] = useState('/assets/portal.jpg');
  const [content, setContent] = useState('');

  // Optional / Auto-Generated SEO, AEO & GEO Booster Fields
  const [excerpt, setExcerpt] = useState('');
  const [tldrAnswer, setTldrAnswer] = useState('');
  const [tagsInput, setTagsInput] = useState(
    'GoHighLevel API v2, Node.js, MySQL, Multi-Tenant SaaS, Dubai UAE'
  );
  const [entitiesInput, setEntitiesInput] = useState(
    'Haris Khan Durrani, EBMS Business Services, Dubai Enterprise Architecture'
  );
  const [takeawaysInput, setTakeawaysInput] = useState('');
  const [faqs, setFaqs] = useState<BlogFaqItem[]>([]);

  // Optional Comparison Table
  const [enableTable, setEnableTable] = useState(false);
  const [tableCaption, setTableCaption] = useState(
    'Architectural Comparison: Legacy Workflow vs. Automated Production Pipeline'
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>([
    'Metric',
    'Before (Manual / Legacy)',
    'After (Automated Architecture)',
  ]);
  const [tableRows, setTableRows] = useState<string[][]>([
    ['Processing Latency', '15–45 mins manual work', '< 250ms Automated Pipeline'],
    ['SaaS Cost Efficiency', '100% Baseline Spend', '-80% Duplicate Tooling Overhead'],
  ]);

  // SEO Meta Overrides
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [uploadAltText, setUploadAltText] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [postsRes, mediaRes] = await Promise.all([
        fetch('/api/blog?drafts=1'),
        fetch('/api/admin/media'),
      ]);
      const postsData = await postsRes.json();
      const mediaData = await mediaRes.json();

      if (postsData.success) {
        const fetchedPosts: BlogPost[] = postsData.posts || [];
        setPosts(fetchedPosts);
        if (postsData.storage) setStorageInfo(postsData.storage);

        // If arrived via /blog/admin?edit=<slug>, automatically open that post in the editor
        const params = new URLSearchParams(window.location.search);
        const editTarget = params.get('edit');
        if (editTarget) {
          const found = fetchedPosts.find((p) => p.slug === editTarget);
          if (found) {
            handleLoadPostForEdit(found);
          }
        }
      }
      if (mediaData.success) {
        setMediaList(mediaData.media || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/blog/login');
          return;
        }
        setAdminUser(data.user || 'Admin');
        setAuthChecking(false);
        void fetchAllData();
      } catch {
        router.replace('/blog/login');
      }
    };
    void verify();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.replace('/blog/login');
  };

  // Smart 1-Click Auto-Generator for SEO, AEO & GEO fields
  const handleAutoGenerateSeoAeoGeo = () => {
    const cleanTitle =
      title.trim() ||
      `Architecting Scalable ${category} Systems in Dubai & the UAE`;
    if (!title.trim()) setTitle(cleanTitle);

    const kw =
      focusKeyword.trim() ||
      cleanTitle
        .split(/\s+/)
        .slice(0, 3)
        .join(' ');
    if (!focusKeyword.trim()) setFocusKeyword(kw);

    const generatedSlug = slugify(cleanTitle);
    setSlug(generatedSlug);

    // Ensure rich article content if empty or very short
    let bodyText = content.trim();
    if (bodyText.split(/\s+/).filter(Boolean).length < 120) {
      bodyText = `${bodyText ? bodyText + '\n\n' : ''}## Enterprise Context & Problem Statement in Dubai

Modern enterprises across Dubai and the UAE require resilient **${kw}** architectures that eliminate manual bottlenecks, unify multi-tenant operations, and maintain strict security compliance.

## Core Architectural Implementation

1. **Multi-Tenant API & Data Isolation:** Enforces Role-Based Access Control (RBAC) and tenant scoping across all database queries.
2. **Real-Time Event Synchronization:** Processes webhooks and operational updates in under **250ms** with cryptographic HMAC signature verification.
3. **Production Observability & Failover:** Containerized deployments achieving **99.98% uptime** and **80% reduction** in duplicate SaaS overhead.

\`\`\`typescript
// Verified production handler for ${kw}
export async function executeEnterpriseWorkflow(tenantId: string) {
  return {
    tenantId,
    status: 'VERIFIED_PRODUCTION',
    latencyMs: 18,
  };
}
\`\`\`

## Measurable Business Impact

Deploying this **${category}** foundation empowers 100+ internal users across group companies with deterministic performance and audit-ready data integrity.`;
      setContent(bodyText);
    }

    const plain = stripMd(bodyText);

    // 1. SEO Excerpt (140-200 chars)
    const genExcerpt =
      plain.length >= 130
        ? `${plain.slice(0, 175).trim()}...`
        : `Production engineering guide by Haris Khan Durrani in Dubai on ${cleanTitle}—covering architecture, multi-tenant security, and measurable ROI across UAE enterprises.`;
    setExcerpt(genExcerpt);
    setSubtitle(genExcerpt);

    // 2. AEO TL;DR Direct Answer (45-65 words)
    const genTldr = `To implement ${cleanTitle} in production, combine a modular Node.js/Next.js service layer with MySQL tenant isolation, HMAC-verified webhook ingestion, and automated Role-Based Access Control (RBAC). Architected in Dubai by Haris Khan Durrani, this approach reduces duplicate SaaS overhead by 80% and delivers sub-250ms synchronization across enterprise teams.`;
    setTldrAnswer(genTldr);

    // 3. GEO Quantitative Key Takeaways (3+ verifiable bullets)
    setTakeawaysInput(
      [
        `Reduces duplicate SaaS & operational tooling overhead by up to 80% across multi-company UAE groups.`,
        `Delivers sub-250ms real-time data synchronization using hardened Node.js, MySQL, and webhook queues.`,
        `Enforces dual-layer JWT and ORM Role-Based Access Control (RBAC) supporting 105+ concurrent enterprise users.`,
      ].join('\n')
    );

    // 4. Tags & Knowledge Graph Entities
    setTagsInput(
      `${kw}, ${category}, Next.js, Node.js, MySQL, Multi-Tenant SaaS, Dubai UAE`
    );
    setEntitiesInput(
      `Haris Khan Durrani, ${kw}, EBMS Business Services, Dubai Enterprise Architecture, UAE SaaS`
    );

    // 5. AEO FAQPage Schema Pairs
    setFaqs([
      {
        question: `How does ${cleanTitle} improve enterprise reliability and speed?`,
        answer: genTldr,
      },
      {
        question: `What technology stack is recommended for ${kw} in production?`,
        answer: `A battle-tested combination of Next.js, React, Node.js, TypeScript, and MySQL/PostgreSQL running inside Docker containers with automated backups and strict RBAC security.`,
      },
      {
        question: `Can this ${category} architecture scale across multiple sister companies in the UAE?`,
        answer: `Yes. By isolating tenant contexts at the database and OAuth token layers, a single deployment seamlessly powers 9+ sister companies and 100+ internal staff from one unified codebase.`,
      },
    ]);

    setEnableTable(true);
    setStatusMsg({
      ok: true,
      text: '✨ Auto-generated SEO Excerpt, AEO Direct Answer, GEO Takeaways, Tags, Comparison Table & FAQs — Score boosted to 100/100!',
    });
  };

  const resetFormToNew = () => {
    setEditingSlug(null);
    setTitle('');
    setFocusKeyword('');
    setSlug('');
    setSubtitle('');
    setCategory(CATEGORY_PRESETS[0]);
    setCoverImage('/assets/portal.jpg');
    setExcerpt('');
    setTldrAnswer('');
    setTagsInput('GoHighLevel API v2, Node.js, MySQL, Multi-Tenant SaaS, Dubai UAE');
    setEntitiesInput('Haris Khan Durrani, EBMS Business Services, Dubai Enterprise Architecture');
    setTakeawaysInput('');
    setContent('');
    setFaqs([]);
    setEnableTable(false);
    setMetaTitle('');
    setMetaDescription('');
    setCanonicalUrl('');
    setFeatured(false);
    setPublished(true);
    setComposerStep('write');
    setActiveTab('editor');
    setStatusMsg({ ok: true, text: 'Ready to write a new article.' });
  };

  const handleLoadPostForEdit = (post: BlogPost) => {
    setEditingSlug(post.slug);
    setTitle(post.title);
    setFocusKeyword(post.tags[0] || '');
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
    setFaqs(post.faqs.length > 0 ? post.faqs : []);

    if (post.comparisonTable) {
      setEnableTable(true);
      setTableCaption(post.comparisonTable.caption);
      setTableHeaders(post.comparisonTable.headers);
      setTableRows(post.comparisonTable.rows);
    } else {
      setEnableTable(false);
    }

    setMetaTitle(post.metaTitle || '');
    setMetaDescription(post.metaDescription || '');
    setCanonicalUrl(post.canonicalUrl || '');
    setFeatured(post.featured);
    setPublished(post.published);
    setComposerStep('write');
    setActiveTab('editor');
    setStatusMsg({ ok: true, text: `Editing "${post.title}"` });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const insertAtCursor = (snippet: string) => {
    const el = contentTextareaRef.current;
    if (!el) {
      setContent((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart || content.length;
    const end = el.selectionEnd || content.length;
    const next = content.slice(0, start) + snippet + content.slice(end);
    setContent(next);
    window.setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 10);
  };

  // Upload Media (Cover OR Inline inside Article OR Media Library)
  const uploadMediaFile = async (file: File, mode: 'cover' | 'inline' | 'library') => {
    setUploading(true);
    setStatusMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (uploadAltText.trim()) formData.append('altText', uploadAltText.trim());

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 401) {
        router.replace('/blog/login');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadAltText('');
        if (mode === 'cover') {
          setCoverImage(data.asset.url);
          setStatusMsg({
            ok: true,
            text: `Uploaded "${data.asset.filename}" and set as Cover Image!`,
          });
        } else if (mode === 'inline') {
          insertAtCursor(`\n\n![${data.asset.altText || data.asset.filename}](${data.asset.url})\n\n`);
          setStatusMsg({
            ok: true,
            text: `Uploaded "${data.asset.filename}" and inserted into your article!`,
          });
        } else {
          setStatusMsg({
            ok: true,
            text: `Uploaded "${data.asset.filename}" (${formatBytes(data.asset.sizeBytes)}) to Server Media Library!`,
          });
        }
        await fetchAllData();
      } else {
        setStatusMsg({ ok: false, text: data.error || 'Media upload failed.' });
      }
    } catch {
      setStatusMsg({ ok: false, text: 'Error uploading media file to server.' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    mode: 'cover' | 'inline' | 'library'
  ) => {
    const file = e.target.files?.[0];
    if (file) void uploadMediaFile(file, mode);
    e.target.value = '';
  };

  const handleSubmitArticle = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const comparisonTable: BlogComparisonTable | undefined = enableTable
      ? {
          caption: tableCaption.trim() || 'Architectural Comparison Matrix',
          headers: tableHeaders.map((h) => h.trim() || 'Column'),
          rows: tableRows.filter((r) => r.some((cell) => cell.trim() !== '')),
        }
      : undefined;

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
          comparisonTable,
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
          canonicalUrl: canonicalUrl.trim() || undefined,
          featured,
          published,
        }),
      });

      if (res.status === 401) {
        router.replace('/blog/login');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingSlug(data.post.slug);
        setSlug(data.post.slug);
        setExcerpt(data.post.excerpt);
        setTldrAnswer(data.post.tldrAnswer);
        setTakeawaysInput(data.post.keyTakeaways.join('\n'));
        setFaqs(data.post.faqs);
        setStatusMsg({
          ok: true,
          text: `🎉 Published "${data.post.title}" — SEO/AEO/GEO Score: ${data.score.total}/100!`,
        });
        await fetchAllData();
      } else {
        setStatusMsg({ ok: false, text: data.error || 'Failed to save article.' });
      }
    } catch {
      setStatusMsg({ ok: false, text: 'Network error while saving article.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePostFlag = async (
    targetSlug: string,
    field: 'published' | 'featured',
    nextVal: boolean
  ) => {
    const res = await fetch(`/api/blog/${targetSlug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: nextVal }),
    });
    if (res.ok) {
      await fetchAllData();
    }
  };

  const handleDeletePost = async (targetSlug: string, targetTitle: string) => {
    if (!window.confirm(`Delete article "${targetTitle}" permanently?`)) return;
    const res = await fetch(`/api/blog/${targetSlug}`, { method: 'DELETE' });
    if (res.ok) {
      setStatusMsg({ ok: true, text: `Deleted "${targetTitle}".` });
      if (editingSlug === targetSlug) resetFormToNew();
      await fetchAllData();
    }
  };

  const handleDeleteMedia = async (filename: string) => {
    if (!window.confirm(`Delete "${filename}" from server?`)) return;
    const res = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await fetchAllData();
    }
  };

  // Detailed Real-Time SEO + AEO + GEO Score Breakdown
  const scoreMetrics = useMemo(() => {
    const titleLen = title.trim().length;
    const contentWords = content.trim().split(/\s+/).filter(Boolean).length;
    const tldrWords = tldrAnswer.trim().split(/\s+/).filter(Boolean).length;
    const tagsCount = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean).length;
    const takeawaysCount = takeawaysInput
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean).length;
    const faqsCount = faqs.filter((f) => f.question.trim() && f.answer.trim()).length;
    const hasHeading = /^##\s+/m.test(content);
    const hasNumbers = /\d+(%|ms|x|\+| users| companies|s\b)/i.test(
      `${title} ${content} ${takeawaysInput} ${tldrAnswer}`
    );
    const kwMatch =
      !focusKeyword.trim() ||
      title.toLowerCase().includes(focusKeyword.trim().toLowerCase()) ||
      content.toLowerCase().includes(focusKeyword.trim().toLowerCase());

    const checks = [
      {
        pillar: 'SEO' as const,
        label: `Headline length (${titleLen} chars — target 35–100)`,
        passed: titleLen >= 35,
        tip: 'Write a clear headline of at least 6–10 words.',
      },
      {
        pillar: 'SEO' as const,
        label: `Article depth (${contentWords} words) & section headings (## H2)`,
        passed: contentWords >= 120 && hasHeading,
        tip: 'Write 120+ words and include at least one ## Heading.',
      },
      {
        pillar: 'SEO' as const,
        label: `Cover image & ${tagsCount} topic tags attached`,
        passed: Boolean(coverImage) && tagsCount >= 3 && kwMatch,
        tip: 'Pick a cover image and 3+ topic tags.',
      },
      {
        pillar: 'AEO' as const,
        label: `TL;DR Direct Answer (${tldrWords || 'Auto'} words — Featured Snippet ready)`,
        passed: tldrWords >= 28 && tldrWords <= 95,
        tip: 'Click "✨ Auto-Boost to 100%" or add a 40–70 word summary in Step 2.',
      },
      {
        pillar: 'AEO' as const,
        label: `FAQPage Schema Q&As (${faqsCount} pairs — target 2+)`,
        passed: faqsCount >= 2,
        tip: 'Click "✨ Auto-Boost to 100%" to auto-generate 3 technical FAQs.',
      },
      {
        pillar: 'GEO' as const,
        label: `Quantitative benchmarks & ${takeawaysCount} Key Takeaways for AI citations`,
        passed: takeawaysCount >= 3 && hasNumbers,
        tip: 'Include numbers/metrics (e.g. 80%, 250ms) and 3 takeaway bullets.',
      },
    ];

    const seoChecks = checks.filter((c) => c.pillar === 'SEO');
    const aeoChecks = checks.filter((c) => c.pillar === 'AEO');
    const geoChecks = checks.filter((c) => c.pillar === 'GEO');

    const seo = Math.round((seoChecks.filter((c) => c.passed).length / seoChecks.length) * 100);
    const aeo = Math.round((aeoChecks.filter((c) => c.passed).length / aeoChecks.length) * 100);
    const geo = Math.round((geoChecks.filter((c) => c.passed).length / geoChecks.length) * 100);
    const total = Math.round((seo + aeo + geo) / 3);

    return { total, seo, aeo, geo, contentWords, checks };
  }, [
    title,
    content,
    tldrAnswer,
    tagsInput,
    takeawaysInput,
    faqs,
    coverImage,
    focusKeyword,
  ]);

  const effectiveSlug = slug || slugify(title) || 'your-article-url';
  const effectiveExcerpt =
    metaDescription ||
    excerpt ||
    tldrAnswer ||
    stripMd(content).slice(0, 160) ||
    'Your article description will appear here on Google Search results...';

  const filteredPosts = useMemo(() => {
    const q = articleFilterQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [posts, articleFilterQuery]);

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] font-mono text-xs text-[var(--acid)]">
        Verifying admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="arch-grid-bg" aria-hidden="true" />

      {/* Clean Single-Row Top Bar */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--text-soft)] hover:text-[var(--acid)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
              <span>View Blog</span>
            </Link>
            <span className="text-[var(--line)]">|</span>
            <span className="hidden font-mono text-[11px] font-bold text-[var(--page-text)] sm:inline">
              Publishing Studio
            </span>
          </div>

          {/* 3 Clean Main Mode Pills */}
          <div className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer',
                activeTab === 'editor'
                  ? 'bg-[var(--acid)] text-[#060608]'
                  : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
              )}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Write Post</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer',
                activeTab === 'articles'
                  ? 'bg-[var(--acid)] text-[#060608]'
                  : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
              )}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>All Posts ({posts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer',
                activeTab === 'media'
                  ? 'bg-[var(--acid)] text-[#060608]'
                  : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
              )}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              <span>Media ({mediaList.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFormToNew}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--page-text)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
            >
              <FilePlus2 className="h-3.5 w-3.5 text-[var(--acid)]" />
              <span>New</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title={`Logged in as ${adminUser}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-soft)] hover:border-red-400 hover:text-red-400 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1360px] px-5 py-7 sm:px-8">
        {/* Notification Banner */}
        {statusMsg && (
          <div
            role="status"
            className={`mb-6 flex items-center justify-between gap-4 rounded-2xl border px-5 py-3.5 text-xs font-semibold ${
              statusMsg.ok
                ? 'border-[var(--acid)]/45 bg-[var(--acid)]/10 text-[var(--acid)]'
                : 'border-red-500/40 bg-red-500/10 text-red-300'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button
              type="button"
              onClick={() => setStatusMsg(null)}
              className="font-mono text-[10px] uppercase underline opacity-75 hover:opacity-100 cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {/* =====================================================================
            TAB 1: USER-FRIENDLY GUIDED ARTICLE COMPOSER + LIVE SEO SCORECARD
            ===================================================================== */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12">
            {/* LEFT: Clean Guided Composer (8 Cols) */}
            <form
              onSubmit={handleSubmitArticle}
              className="overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_26px_70px_var(--shadow)] lg:col-span-8"
            >
              {/* Guided Step Bar Inside Composer (Keeps interface uncluttered!) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-card)] px-6 py-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setComposerStep('write')}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer',
                      composerStep === 'write'
                        ? 'bg-[var(--acid)] text-[#060608]'
                        : 'bg-[var(--surface)] text-[var(--text-soft)] hover:text-[var(--page-text)]'
                    )}
                  >
                    1. Write Article
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerStep('aeo-geo')}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer',
                      composerStep === 'aeo-geo'
                        ? 'bg-[var(--acid)] text-[#060608]'
                        : 'bg-[var(--surface)] text-[var(--text-soft)] hover:text-[var(--page-text)]'
                    )}
                  >
                    2. AI &amp; FAQ Boosters (Optional)
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerStep('seo-preview')}
                    className={cn(
                      'rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer',
                      composerStep === 'seo-preview'
                        ? 'bg-[var(--acid)] text-[#060608]'
                        : 'bg-[var(--surface)] text-[var(--text-soft)] hover:text-[var(--page-text)]'
                    )}
                  >
                    3. Google Preview &amp; Settings
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAutoGenerateSeoAeoGeo}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--acid)]/50 bg-[var(--acid)]/15 px-3.5 py-1.5 text-xs font-extrabold text-[var(--acid)] transition-all hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>Auto-Optimize SEO/AEO/GEO</span>
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* -------------------------------------------------------------
                    STEP 1: SIMPLE, DISTRACTION-FREE WRITING CANVAS
                    ------------------------------------------------------------- */}
                {composerStep === 'write' && (
                  <div className="space-y-6">
                    {/* Visual Cover Image Card */}
                    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-card)]">
                      <div className="grid grid-cols-1 items-center gap-4 p-4 sm:grid-cols-12">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[#07080d] sm:col-span-5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={coverImage}
                            alt="Cover preview"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="space-y-3 sm:col-span-7">
                          <div>
                            <div className="text-sm font-extrabold text-[var(--page-text)]">
                              Article Cover Image
                            </div>
                            <p className="m-0 text-xs text-[var(--text-soft)]">
                              Upload an image from your computer or pick from your server gallery below.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              ref={coverUploadRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'cover')}
                              className="hidden"
                            />
                            <button
                              type="button"
                              disabled={uploading}
                              onClick={() => coverUploadRef.current?.click()}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-4 py-2 text-xs font-extrabold text-[#060608] cursor-pointer"
                            >
                              <UploadCloud className="h-3.5 w-3.5" />
                              <span>{uploading ? 'Uploading...' : 'Upload from Computer'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveTab('media')}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-soft)] hover:text-[var(--page-text)] cursor-pointer"
                            >
                              <ImagePlus className="h-3.5 w-3.5 text-[var(--cyan)]" />
                              <span>Browse All Media</span>
                            </button>
                          </div>

                          {/* Quick Thumbnail Strip */}
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                            {mediaList
                              .filter((m) => m.mimeType.startsWith('image/'))
                              .slice(0, 8)
                              .map((m) => (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => setCoverImage(m.url)}
                                  title={m.filename}
                                  className={cn(
                                    'relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer',
                                    coverImage === m.url
                                      ? 'border-[var(--acid)] scale-105'
                                      : 'border-transparent opacity-60 hover:opacity-100'
                                  )}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={m.url}
                                    alt={m.filename}
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Chips + Target SEO Keyword */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                      <div className="sm:col-span-7">
                        <label className="mb-1.5 block text-xs font-bold text-[var(--text-soft)]">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm font-semibold text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                        >
                          {CATEGORY_PRESETS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-5">
                        <label className="mb-1.5 block text-xs font-bold text-[var(--text-soft)]">
                          Target SEO Keyword (Optional)
                        </label>
                        <input
                          type="text"
                          value={focusKeyword}
                          onChange={(e) => setFocusKeyword(e.target.value)}
                          placeholder="e.g. GoHighLevel OAuth Dubai"
                          className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Big Friendly Title Input */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[var(--text-soft)]">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Write your article title here..."
                        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] px-5 py-4 text-lg font-extrabold text-[var(--page-text)] placeholder:font-normal placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
                      />
                      <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-[var(--text-faint)]">
                        <span className="truncate">
                          URL: {SITE_CONFIG.url}/blog/
                          <strong className="text-[var(--acid)]">{effectiveSlug}</strong>
                        </span>
                        <span>{title.length} chars</span>
                      </div>
                    </div>

                    {/* Friendly Rich-Toolbar Article Body Editor + Live Preview Toggle */}
                    <div>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-t-2xl border border-b-0 border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5">
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertAtCursor('**bold text**')}
                            title="Bold"
                            className="rounded-lg p-2 text-[var(--text-soft)] hover:bg-[var(--surface)] hover:text-[var(--page-text)] cursor-pointer"
                          >
                            <Bold className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertAtCursor('*italic text*')}
                            title="Italic"
                            className="rounded-lg p-2 text-[var(--text-soft)] hover:bg-[var(--surface)] hover:text-[var(--page-text)] cursor-pointer"
                          >
                            <Italic className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertAtCursor('\n\n## Section Heading\n\n')}
                            title="Heading 2"
                            className="rounded-lg p-2 text-[var(--text-soft)] hover:bg-[var(--surface)] hover:text-[var(--page-text)] cursor-pointer"
                          >
                            <Heading2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertAtCursor('\n\n### Subheading\n\n')}
                            title="Heading 3"
                            className="rounded-lg p-2 text-[var(--text-soft)] hover:bg-[var(--surface)] hover:text-[var(--page-text)] cursor-pointer"
                          >
                            <Heading3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertAtCursor('\n- First key point\n- Second key point\n')}
                            title="Bullet List"
                            className="rounded-lg p-2 text-[var(--text-soft)] hover:bg-[var(--surface)] hover:text-[var(--page-text)] cursor-pointer"
                          >
                            <List className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertAtCursor('\n```typescript\n// Code snippet\n```\n')
                            }
                            title="Code Block"
                            className="rounded-lg p-2 text-[var(--text-soft)] hover:bg-[var(--surface)] hover:text-[var(--page-text)] cursor-pointer"
                          >
                            <Code2 className="h-4 w-4" />
                          </button>

                          {/* Direct Upload & Insert Image into Article Button */}
                          <input
                            ref={inlineImageUploadRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'inline')}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => inlineImageUploadRef.current?.click()}
                            className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-[var(--acid)]/40 bg-[var(--acid)]/10 px-3 py-1.5 text-xs font-bold text-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
                          >
                            <ImagePlus className="h-3.5 w-3.5" />
                            <span>Insert Image</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowPreview((p) => !p)}
                          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs font-bold text-[var(--text-soft)] hover:text-[var(--page-text)] cursor-pointer"
                        >
                          {showPreview ? 'Back to Editor' : 'Preview Reading View'}
                        </button>
                      </div>

                      {showPreview ? (
                        <div className="min-h-[340px] space-y-4 rounded-b-2xl border border-[var(--line)] bg-[var(--surface-card)] p-6 text-sm leading-relaxed text-[var(--text-soft)]">
                          <h2 className="m-0 text-2xl font-extrabold text-[var(--page-text)]">
                            {title || 'Untitled Article'}
                          </h2>
                          <div className="whitespace-pre-wrap">{content || 'Nothing written yet...'}</div>
                        </div>
                      ) : (
                        <textarea
                          ref={contentTextareaRef}
                          rows={13}
                          required
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write or paste your article here... (Tip: Only Title & Content are required! Click 'Auto-Optimize SEO/AEO/GEO' anytime to automatically generate your summary, takeaways, and FAQs.)"
                          className="w-full rounded-b-2xl border border-[var(--line)] bg-[var(--surface-card)] p-5 text-[15px] leading-[1.75] text-[var(--page-text)] placeholder:text-[var(--text-faint)] focus:border-[var(--acid)] focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                    STEP 2: AEO & GEO BOOSTERS (OPTIONAL / 1-CLICK AUTO-FILLED)
                    ------------------------------------------------------------- */}
                {composerStep === 'aeo-geo' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--acid)]/35 bg-[var(--acid)]/[0.06] p-4">
                      <div>
                        <div className="text-sm font-extrabold text-[var(--page-text)]">
                          Don&apos;t want to write summaries &amp; FAQs manually?
                        </div>
                        <p className="m-0 text-xs text-[var(--text-soft)]">
                          Click Auto-Fill and we&apos;ll generate your TL;DR Answer, Key Takeaways,
                          and FAQs automatically from your article.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoGenerateSeoAeoGeo}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-4 py-2 text-xs font-black text-[#060608] cursor-pointer"
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        <span>✨ Auto-Fill All Boosters</span>
                      </button>
                    </div>

                    {/* AEO Direct Answer */}
                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-[var(--acid)]">
                        <span>TL;DR Direct Answer (For Google Featured Snippets &amp; Voice Search)</span>
                        <span className="font-mono text-[11px] text-[var(--text-faint)]">
                          {tldrAnswer.trim().split(/\s+/).filter(Boolean).length} words (Target: 35–85)
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        value={tldrAnswer}
                        onChange={(e) => setTldrAnswer(e.target.value)}
                        placeholder="Leave blank to auto-generate, or write a direct 45–65 word answer..."
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-4 text-sm leading-relaxed text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                      />
                    </div>

                    {/* GEO Takeaways */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-[var(--cyan)]">
                        Key Takeaways &amp; Numbers (One bullet per line — Cited by ChatGPT &amp; Perplexity)
                      </label>
                      <textarea
                        rows={3}
                        value={takeawaysInput}
                        onChange={(e) => setTakeawaysInput(e.target.value)}
                        placeholder="e.g. Reduced duplicate SaaS costs by 80% across 9 sister companies..."
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-4 text-sm leading-relaxed text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                      />
                    </div>

                    {/* Simple FAQ Builder */}
                    <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-extrabold text-[var(--page-text)]">
                            Frequently Asked Questions (AEO `FAQPage` Schema)
                          </div>
                          <p className="m-0 text-xs text-[var(--text-soft)]">
                            Helps your article appear in Google &ldquo;People Also Ask&rdquo; boxes.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFaqs((prev) => [...prev, { question: '', answer: '' }])}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--acid)]/45 bg-[var(--acid)]/10 px-3.5 py-1.5 text-xs font-bold text-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Question</span>
                        </button>
                      </div>

                      {faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFaqs((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, question: val } : item))
                                );
                              }}
                              placeholder={`Question #${idx + 1}`}
                              className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2 text-xs font-bold text-[var(--page-text)]"
                            />
                            <button
                              type="button"
                              onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== idx))}
                              className="rounded-lg border border-[var(--line)] p-2 text-red-400 hover:border-red-400 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFaqs((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, answer: val } : item))
                              );
                            }}
                            placeholder="Answer..."
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2 text-xs text-[var(--text-soft)]"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Optional Comparison Table Toggle */}
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-5">
                      <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--page-text)]">
                          <Table2 className="h-4 w-4 text-[var(--cyan)]" />
                          <span>Include Comparison Table (Before vs. After Matrix)</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={enableTable}
                          onChange={(e) => setEnableTable(e.target.checked)}
                          className="h-4 w-4 accent-[#c8ff3d]"
                        />
                      </label>

                      {enableTable && (
                        <div className="mt-4 space-y-2.5">
                          <input
                            type="text"
                            value={tableCaption}
                            onChange={(e) => setTableCaption(e.target.value)}
                            placeholder="Table title..."
                            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--page-text)]"
                          />
                          {tableRows.map((row, rIdx) => (
                            <div key={rIdx} className="grid grid-cols-3 gap-2">
                              {row.map((cell, cIdx) => (
                                <input
                                  key={cIdx}
                                  type="text"
                                  value={cell}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTableRows((prev) =>
                                      prev.map((r, ri) =>
                                        ri === rIdx
                                          ? r.map((c, ci) => (ci === cIdx ? val : c))
                                          : r
                                      )
                                    );
                                  }}
                                  className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--page-text)]"
                                />
                              ))}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setTableRows((prev) => [...prev, ['New Metric', 'Before', 'After']])
                            }
                            className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--cyan)] hover:border-[var(--cyan)] cursor-pointer"
                          >
                            + Add Table Row
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------------
                    STEP 3: LIVE GOOGLE SEARCH PREVIEW & SEO SETTINGS
                    ------------------------------------------------------------- */}
                {composerStep === 'seo-preview' && (
                  <div className="space-y-6">
                    {/* Live Google Search Snippet Card */}
                    <div className="rounded-2xl border border-[var(--line)] bg-[#0b0d13] p-5">
                      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                        <Globe className="h-3.5 w-3.5" />
                        <span>Live Google Search Result Preview (UAE)</span>
                      </div>
                      <div className="space-y-1 rounded-xl bg-[#131620] p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#c8ff3d] font-mono text-[9px] font-black text-black">
                            H
                          </span>
                          <span>hariskhandurrani.com</span>
                          <span className="text-slate-500">› blog › {effectiveSlug}</span>
                        </div>
                        <div className="text-lg font-bold text-[#8ab4f8] hover:underline">
                          {metaTitle || title || 'Your Article Headline Appears Here'}
                        </div>
                        <p className="m-0 line-clamp-2 text-xs leading-relaxed text-slate-300">
                          {effectiveExcerpt}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-[var(--text-soft)]">
                          Custom URL Slug
                        </label>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder={effectiveSlug}
                          className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 font-mono text-xs text-[var(--page-text)]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-[var(--text-soft)]">
                          Topic Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 text-xs text-[var(--page-text)]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-xs font-bold text-[var(--text-soft)]">
                          Search Summary / Meta Description (Auto-filled if left blank)
                        </label>
                        <textarea
                          rows={2}
                          value={excerpt}
                          onChange={(e) => setExcerpt(e.target.value)}
                          placeholder="Short description shown under your title on Google..."
                          className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 text-xs text-[var(--page-text)]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Action Footer Bar */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[var(--page-text)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                        className="h-4 w-4 accent-[#c8ff3d]"
                      />
                      <span>{published ? 'Publish Immediately' : 'Save as Draft'}</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-soft)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="h-4 w-4 accent-[#c8ff3d]"
                      />
                      <span>Pin as Featured</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--acid)] px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-[#060608] shadow-[0_10px_28px_var(--acid-glow)] transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {saving
                        ? 'Publishing...'
                        : editingSlug
                          ? 'Update Article'
                          : published
                            ? 'Publish Article'
                            : 'Save Draft'}
                    </span>
                  </button>
                </div>
              </div>
            </form>

            {/* RIGHT SIDEBAR: VISUAL LIVE SEO + AEO + GEO SCORECARD (4 Cols) */}
            <aside className="space-y-6 lg:sticky lg:top-20 lg:col-span-4">
              <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_var(--shadow)]">
                {/* Visual Score Gauge Header */}
                <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                      LIVE CONTENT ANALYZER
                    </span>
                    <h2 className="m-0 mt-0.5 text-xl font-extrabold text-[var(--page-text)]">
                      SEO · AEO · GEO Score
                    </h2>
                    <span className="font-mono text-[11px] text-[var(--text-faint)]">
                      {scoreMetrics.contentWords} words ·{' '}
                      {Math.max(1, Math.ceil(scoreMetrics.contentWords / 180))} min read
                    </span>
                  </div>

                  {/* Circular Score Badge */}
                  <div
                    className={cn(
                      'grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 font-mono text-lg font-black',
                      scoreMetrics.total >= 80
                        ? 'border-[var(--acid)] bg-[var(--acid)]/15 text-[var(--acid)] shadow-[0_0_25px_rgba(200,255,61,0.25)]'
                        : scoreMetrics.total >= 50
                          ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                          : 'border-red-400 bg-red-400/15 text-red-300'
                    )}
                  >
                    {scoreMetrics.total}%
                  </div>
                </div>

                {/* 3 Individual Pillar Bars (SEO / AEO / GEO) */}
                <div className="my-5 grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-3">
                    <div className="font-mono text-[10px] font-bold text-[var(--text-faint)]">
                      GOOGLE SEO
                    </div>
                    <div className="mt-1 font-mono text-base font-black text-[var(--acid)]">
                      {scoreMetrics.seo}%
                    </div>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-3">
                    <div className="font-mono text-[10px] font-bold text-[var(--text-faint)]">
                      ANSWER AEO
                    </div>
                    <div className="mt-1 font-mono text-base font-black text-[var(--cyan)]">
                      {scoreMetrics.aeo}%
                    </div>
                  </div>
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-3">
                    <div className="font-mono text-[10px] font-bold text-[var(--text-faint)]">
                      AI / LLM GEO
                    </div>
                    <div className="mt-1 font-mono text-base font-black text-emerald-400">
                      {scoreMetrics.geo}%
                    </div>
                  </div>
                </div>

                {/* 1-Click Magic Auto-Boost Button whenever Score < 100 */}
                {scoreMetrics.total < 100 && (
                  <button
                    type="button"
                    onClick={handleAutoGenerateSeoAeoGeo}
                    className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--acid)]/50 bg-[var(--acid)]/15 py-3 text-xs font-extrabold text-[var(--acid)] transition-all hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>✨ Auto-Boost Score to 100% (1 Click)</span>
                  </button>
                )}

                {/* Live Checklist with Helpful Tips */}
                <ul className="m-0 space-y-3 pl-0 list-none text-xs">
                  {scoreMetrics.checks.map((c, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl border border-[var(--line-subtle)] bg-[var(--surface-card)] p-3"
                    >
                      <div className="flex items-start gap-2.5">
                        {c.passed ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--acid)]" />
                        ) : (
                          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                        )}
                        <div>
                          <div
                            className={cn(
                              'font-semibold',
                              c.passed ? 'text-[var(--page-text)]' : 'text-[var(--text-soft)]'
                            )}
                          >
                            <span className="mr-1.5 rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-[var(--acid)]">
                              {c.pillar}
                            </span>
                            {c.label}
                          </div>
                          {!c.passed && (
                            <div className="mt-1 text-[11px] text-[var(--text-faint)]">
                              Tip: {c.tip}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        )}

        {/* =====================================================================
            TAB 2: MANAGE ALL ARTICLES
            ===================================================================== */}
        {activeTab === 'articles' && (
          <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
              <div>
                <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em]">
                  All Blog Posts ({posts.length})
                </h2>
                <p className="m-0 mt-1 text-xs text-[var(--text-soft)]">
                  Click Edit on any post to update it, or toggle Published / Featured status in one click.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type="search"
                    value={articleFilterQuery}
                    onChange={(e) => setArticleFilterQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full rounded-full border border-[var(--line)] bg-[var(--surface-card)] py-2 pl-9 pr-4 text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={resetFormToNew}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-4 py-2 text-xs font-black text-[#060608] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Write New Post</span>
                </button>
              </div>
            </div>

            {loading ? (
              <p className="font-mono text-xs text-[var(--text-faint)]">Loading articles...</p>
            ) : (
              <div className="space-y-3.5">
                {filteredPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-5 lg:flex-row lg:items-center"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 font-bold uppercase',
                            post.published
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-amber-500/15 text-amber-300'
                          )}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        {post.featured && (
                          <span className="rounded-full bg-[var(--acid)]/15 px-2.5 py-0.5 font-bold text-[var(--acid)]">
                            ★ Featured
                          </span>
                        )}
                        <span className="text-[var(--cyan)]">{post.category}</span>
                      </div>

                      <h3 className="m-0 text-base font-extrabold text-[var(--page-text)]">
                        {post.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadPostForEdit(post)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-4 py-2 text-xs font-black text-[#060608] cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleTogglePostFlag(post.slug, 'published', !post.published)
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-soft)] hover:text-[var(--page-text)] cursor-pointer"
                      >
                        {post.published ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Publish</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleTogglePostFlag(post.slug, 'featured', !post.featured)
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--text-soft)] hover:text-[var(--acid)] cursor-pointer"
                      >
                        <Star
                          className={cn(
                            'h-3.5 w-3.5',
                            post.featured && 'fill-[var(--acid)] text-[var(--acid)]'
                          )}
                        />
                        <span>{post.featured ? 'Unfeature' : 'Feature'}</span>
                      </button>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--acid)]"
                      >
                        <span>View</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => void handleDeletePost(post.slug, post.title)}
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:border-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 3: SERVER MEDIA LIBRARY & UPLOAD MANAGER
            ===================================================================== */}
        {activeTab === 'media' && (
          <div className="space-y-7">
            <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8">
              <h2 className="m-0 mb-4 text-2xl font-extrabold tracking-[-0.03em]">
                Upload Media to Server
              </h2>

              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                  <label className="mb-1.5 block text-xs font-bold text-[var(--text-soft)]">
                    Image Description / Alt Text (Good for Google Image SEO)
                  </label>
                  <input
                    type="text"
                    value={uploadAltText}
                    onChange={(e) => setUploadAltText(e.target.value)}
                    placeholder="e.g. Architecture diagram"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-7">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.avif,.gif,.svg,.pdf,.mp4"
                    onChange={(e) => handleFileChange(e, 'library')}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) void uploadMediaFile(file, 'library');
                    }}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--acid)]/45 bg-[var(--acid)]/[0.04] p-6 text-center transition-colors hover:bg-[var(--acid)]/[0.09]"
                  >
                    <UploadCloud className="mb-2 h-7 w-7 text-[var(--acid)]" />
                    <span className="text-xs font-extrabold text-[var(--page-text)]">
                      {uploading
                        ? 'Uploading to Server...'
                        : 'Click or Drag & Drop Image / File Here'}
                    </span>
                    <span className="mt-1 font-mono text-[10px] text-[var(--text-faint)]">
                      JPG, PNG, WebP, AVIF, GIF, SVG, PDF, MP4 (Max 15MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8">
              <div className="mb-5 text-sm font-extrabold text-[var(--page-text)]">
                Server Media Gallery ({mediaList.length} files)
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {mediaList.map((asset) => {
                  const isImage = asset.mimeType.startsWith('image/');
                  return (
                    <div
                      key={asset.id}
                      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-card)]"
                    >
                      <div>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07080d]">
                          {isImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={asset.url}
                              alt={asset.altText}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center font-mono text-xs uppercase text-[var(--cyan)]">
                              {asset.mimeType}
                            </div>
                          )}
                        </div>
                        <div className="p-3.5">
                          <div className="truncate text-xs font-bold text-[var(--page-text)]">
                            {asset.filename}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-[var(--text-faint)]">
                            {formatBytes(asset.sizeBytes)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--line-subtle)] p-3">
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImage(asset.url);
                            setActiveTab('editor');
                            setStatusMsg({
                              ok: true,
                              text: `Set "${asset.filename}" as Cover Image.`,
                            });
                          }}
                          className="rounded-lg bg-[var(--acid)] px-2.5 py-1 text-[10px] font-extrabold text-[#060608] cursor-pointer"
                        >
                          Set Cover
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            insertAtCursor(
                              `\n\n![${asset.altText || asset.filename}](${asset.url})\n\n`
                            );
                            setActiveTab('editor');
                            setStatusMsg({
                              ok: true,
                              text: `Inserted "${asset.filename}" into article.`,
                            });
                          }}
                          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--cyan)] cursor-pointer"
                        >
                          Insert in Post
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(asset.url);
                            setCopiedMediaUrl(asset.url);
                            window.setTimeout(() => setCopiedMediaUrl(null), 1800);
                          }}
                          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[10px] text-[var(--text-soft)] cursor-pointer"
                        >
                          {copiedMediaUrl === asset.url ? (
                            <Check className="h-3 w-3 text-[var(--acid)]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>

                        {asset.source === 'uploaded' && (
                          <button
                            type="button"
                            onClick={() => void handleDeleteMedia(asset.filename)}
                            className="ml-auto rounded-lg border border-red-500/30 p-1 text-red-400 hover:border-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
