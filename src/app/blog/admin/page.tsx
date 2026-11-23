'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Edit3,
  Eye,
  EyeOff,
  FilePlus2,
  FolderOpen,
  ImagePlus,
  LogOut,
  Plus,
  Save,
  Search,
  Sparkles,
  Star,
  Table2,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import type { BlogComparisonTable, BlogFaqItem, BlogPost } from '@/data/blog-seed';
import type { MediaAssetItem } from '@/app/api/admin/media/route';
import { cn } from '@/lib/utils';

type StudioTab = 'editor' | 'articles' | 'media';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BlogAdminStudioPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const coverUploadRef = useRef<HTMLInputElement | null>(null);

  // Auth & global states
  const [authChecking, setAuthChecking] = useState(true);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StudioTab>('editor');

  // Data lists
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

  // Article Editor State
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
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

  // GEO Comparison Table Editor
  const [enableTable, setEnableTable] = useState(true);
  const [tableCaption, setTableCaption] = useState(
    'Architectural Comparison: Legacy Workflow vs. Automated Production Pipeline'
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>([
    'Architecture Metric',
    'Legacy Approach (Before)',
    'Production Architecture (After)',
  ]);
  const [tableRows, setTableRows] = useState<string[][]>([
    ['Sync Latency', '15–45 min manual polling', '< 250ms Real-Time Webhook Sync'],
    ['Tooling Overhead', '100% Baseline Spend', '-80% Duplicate SaaS Spend'],
  ]);

  // SEO Overrides & Flags
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  // Media Upload Alt Text
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
        setPosts(postsData.posts || []);
        if (postsData.storage) setStorageInfo(postsData.storage);
      }
      if (mediaData.success) {
        setMediaList(mediaData.media || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify Admin Auth on mount
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/blog/login');
          return;
        }
        setAdminUser(data.user || 'haris.khan5117@gmail.com');
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

  const resetFormToNew = () => {
    setEditingSlug(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setCategory('CRM & Automation Architecture');
    setCoverImage('/assets/portal.jpg');
    setExcerpt('');
    setTldrAnswer('');
    setTagsInput('GoHighLevel API v2, Node.js, MySQL, Multi-Tenant SaaS, Dubai IT');
    setEntitiesInput('Haris Khan Durrani, EBMS Business Services, Dubai Enterprise Architecture');
    setTakeawaysInput(
      'Reduced duplicate SaaS licensing overhead by 80% across 9 sister companies.\nUnified 105 internal users onto a single white-label OAuth 2.0 foundation.\nAchieved sub-250ms real-time webhook synchronization with HMAC-SHA256 verification.'
    );
    setContent(
      '## Architectural Context\n\nExplain the enterprise bottleneck and system constraints...\n\n## Core Implementation\n\n```typescript\n// Production implementation snippet\nexport async function syncTenantPipeline(tenantId: string) {\n  return { status: "VERIFIED", tenantId };\n}\n```\n\n## Production Outcome\n\nSummarize measurable latency, reliability, and cost improvements.'
    );
    setFaqs([
      { question: '', answer: '' },
      { question: '', answer: '' },
    ]);
    setEnableTable(false);
    setMetaTitle('');
    setMetaDescription('');
    setCanonicalUrl('');
    setFeatured(false);
    setPublished(true);
    setActiveTab('editor');
    setStatusMsg({ ok: true, text: 'Started a fresh blank article.' });
  };

  const handleLoadPostForEdit = (post: BlogPost) => {
    setEditingSlug(post.slug);
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
    setActiveTab('editor');
    setStatusMsg({ ok: true, text: `Editing "${post.title}"` });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicatePost = (post: BlogPost) => {
    handleLoadPostForEdit({
      ...post,
      title: `${post.title} (Copy)`,
      slug: `${post.slug}-copy-${Date.now().toString(36).slice(-3)}`,
      featured: false,
      published: false,
    });
    setEditingSlug(null);
    setStatusMsg({
      ok: true,
      text: `Duplicated "${post.title}" as a draft. Click Save to publish.`,
    });
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
        setStatusMsg({
          ok: true,
          text: `Saved & indexed "${data.post.title}" (${data.engine === 'mysql' ? 'MySQL Database' : 'Hybrid JSON Store'}) — SEO/AEO/GEO Score: ${data.score.total}/100!`,
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
      setStatusMsg({
        ok: true,
        text: `Updated "${targetSlug}" (${field} → ${nextVal ? 'ON' : 'OFF'}).`,
      });
      await fetchAllData();
    }
  };

  const handleDeletePost = async (targetSlug: string, targetTitle: string) => {
    if (!window.confirm(`Delete article "${targetTitle}" permanently?`)) return;
    const res = await fetch(`/api/blog/${targetSlug}`, { method: 'DELETE' });
    if (res.ok) {
      setStatusMsg({ ok: true, text: `Deleted article "${targetTitle}".` });
      if (editingSlug === targetSlug) resetFormToNew();
      await fetchAllData();
    }
  };

  // Media Upload Handler (both from Media Library tab and Cover Quick-Upload)
  const uploadMediaFile = async (file: File, setAsCover = false) => {
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
        if (setAsCover) {
          setCoverImage(data.asset.url);
          setStatusMsg({
            ok: true,
            text: `Uploaded "${data.asset.filename}" to server and set as cover image!`,
          });
        } else {
          setStatusMsg({
            ok: true,
            text: `Uploaded "${data.asset.filename}" (${formatBytes(data.asset.sizeBytes)}) to /public/uploads/!`,
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

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>, setAsCover = false) => {
    const file = e.target.files?.[0];
    if (file) void uploadMediaFile(file, setAsCover);
    e.target.value = '';
  };

  const handleDeleteMedia = async (filename: string) => {
    if (!window.confirm(`Delete "${filename}" from the server?`)) return;
    const res = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setStatusMsg({ ok: true, text: `Deleted "${filename}" from server.` });
      await fetchAllData();
    }
  };

  const handleInsertMediaIntoArticle = (asset: MediaAssetItem) => {
    const snippet = asset.mimeType.startsWith('image/')
      ? `\n\n![${asset.altText || asset.filename}](${asset.url})\n`
      : `\n\n[Download ${asset.filename}](${asset.url})\n`;
    setContent((prev) => prev + snippet);
    setActiveTab('editor');
    setStatusMsg({
      ok: true,
      text: `Inserted "${asset.filename}" into article Markdown content.`,
    });
  };

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
        label: 'Descriptive Title (35+ chars) & clean URL slug',
        passed: title.trim().length >= 35,
      },
      {
        pillar: 'SEO',
        label: 'Excerpt (90+ chars) & 4+ technical tags',
        passed: excerpt.trim().length >= 90 && tagsList.length >= 4,
      },
      {
        pillar: 'AEO',
        label: `TL;DR Direct Answer (${tldrWords} words — target 30–95 words)`,
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

      {/* Top Admin Control Bar */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--page-text)] hover:text-[var(--acid)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
              <span>Public Blog</span>
            </Link>
            <span className="text-[var(--line)]">/</span>
            <span className="font-mono text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--acid)]">
              Admin CMS &amp; Media Server
            </span>
          </div>

          {/* Main Studio Switcher Tabs */}
          <div
            role="tablist"
            className="flex flex-wrap items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'editor'}
              onClick={() => setActiveTab('editor')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer',
                activeTab === 'editor'
                  ? 'bg-[var(--acid)] text-[#060608]'
                  : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
              )}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{editingSlug ? 'Edit Article' : 'Write Article'}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'articles'}
              onClick={() => setActiveTab('articles')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer',
                activeTab === 'articles'
                  ? 'bg-[var(--acid)] text-[#060608]'
                  : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
              )}
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>All Articles ({posts.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'media'}
              onClick={() => setActiveTab('media')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer',
                activeTab === 'media'
                  ? 'bg-[var(--acid)] text-[#060608]'
                  : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
              )}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              <span>Media Server ({mediaList.length})</span>
            </button>
          </div>

          {/* Right Admin User & Logout */}
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[10px] text-[var(--text-soft)] xl:inline-flex">
              <Database className="h-3 w-3 text-[var(--acid)]" />
              <span>
                {storageInfo.engine === 'mysql' ? 'MySQL Active' : 'MySQL Hybrid'} · {adminUser}
              </span>
            </span>

            <button
              type="button"
              onClick={async () => {
                setStatusMsg({ ok: true, text: 'Pinging IndexNow (Bing, ChatGPT Search, Copilot)...' });
                const res = await fetch('/api/seo/indexnow', { method: 'POST' });
                const data = await res.json();
                setStatusMsg({
                  ok: true,
                  text: `IndexNow Dispatched (${data.urlCount || 20} URLs): ${data.note || 'Submitted'}`,
                });
              }}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--cyan)]/45 bg-[var(--cyan)]/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-[#060608] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ping IndexNow</span>
            </button>

            <button
              type="button"
              onClick={resetFormToNew}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--acid)]/45 bg-[var(--acid)]/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              <span>+ New Post</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-red-400 hover:border-red-400 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1380px] px-5 py-8 sm:px-8">
        {/* Global Status Toast Banner */}
        {statusMsg && (
          <div
            role="status"
            className={`mb-6 flex items-center justify-between gap-4 rounded-2xl border p-4 font-mono text-xs ${
              statusMsg.ok
                ? 'border-[var(--acid)]/45 bg-[var(--acid)]/10 text-[var(--acid)]'
                : 'border-red-500/40 bg-red-500/10 text-red-300'
            }`}
          >
            <span>{statusMsg.text}</span>
            <button
              type="button"
              onClick={() => setStatusMsg(null)}
              className="text-[10px] uppercase underline opacity-75 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =====================================================================
            TAB 1: ARTICLE EDITOR & SEO / AEO / GEO STUDIO
            ===================================================================== */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleSubmitArticle}
              className="space-y-6 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8 lg:col-span-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                    {editingSlug ? `EDITING: /blog/${editingSlug}` : 'NEW ARTICLE COMPOSER'}
                  </span>
                  <h1 className="m-0 text-2xl font-extrabold tracking-[-0.03em]">
                    {editingSlug ? 'Update Blog Article' : 'Publish New SEO / AEO / GEO Article'}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-soft)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 accent-[#c8ff3d]"
                    />
                    <span>{published ? 'Published (Live)' : 'Draft (Hidden)'}</span>
                  </label>

                  <label className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-soft)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 accent-[#c8ff3d]"
                    />
                    <span>Featured Spotlight</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    Article Headline (H1 &amp; Primary SEO Title) *
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

                {/* Cover Image with Direct Server Upload or Media Library Picker */}
                <div className="sm:col-span-2">
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                      Cover Image (Choose Server Asset or Upload New Image)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={coverUploadRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileInputChange(e, true)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => coverUploadRef.current?.click()}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--acid)]/45 bg-[var(--acid)]/10 px-3 py-1 font-mono text-[10px] font-bold text-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
                      >
                        <UploadCloud className="h-3 w-3" />
                        <span>{uploading ? 'Uploading...' : 'Upload New Cover from PC'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('media')}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-3 py-1 font-mono text-[10px] text-[var(--text-soft)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] cursor-pointer"
                      >
                        <ImagePlus className="h-3 w-3" />
                        <span>Open Media Library</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="/uploads/my-image.jpg"
                      className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2.5 font-mono text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none sm:col-span-2"
                    />
                    <select
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2.5 font-mono text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                    >
                      {mediaList
                        .filter((m) => m.mimeType.startsWith('image/'))
                        .map((m) => (
                          <option key={m.id} value={m.url}>
                            {m.filename} ({m.source})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    Subtitle / Lead Hook
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
                  SEO Excerpt / Summary (110–260 chars) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Concise summary for Google search snippets and Open Graph cards..."
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

              {/* Markdown Content with Quick Formatting & Media Insert Toolbar */}
              <div>
                <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    Article Body (Markdown with ## H2, ### H3 &amp; ```code blocks) *
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setContent((c) => `${c}\n\n## New Section Heading\n\n`)}
                      className="rounded border border-[var(--line)] bg-[var(--surface-card)] px-2 py-0.5 text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
                    >
                      + H2
                    </button>
                    <button
                      type="button"
                      onClick={() => setContent((c) => `${c}\n\n### Subsection Heading\n\n`)}
                      className="rounded border border-[var(--line)] bg-[var(--surface-card)] px-2 py-0.5 text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
                    >
                      + H3
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setContent(
                          (c) =>
                            `${c}\n\n\`\`\`typescript\n// Production snippet\nexport const status = 'VERIFIED';\n\`\`\`\n`
                        )
                      }
                      className="rounded border border-[var(--line)] bg-[var(--surface-card)] px-2 py-0.5 text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
                    >
                      + Code Block
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('media')}
                      className="rounded border border-[var(--cyan)]/40 bg-[var(--cyan)]/10 px-2.5 py-0.5 text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-[#060608] cursor-pointer"
                    >
                      + Insert Media from Server
                    </button>
                  </div>
                </div>
                <textarea
                  rows={11}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] p-4 font-mono text-xs leading-relaxed text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
              </div>

              {/* GEO Structured Comparison Matrix Builder */}
              <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--cyan)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableTable}
                      onChange={(e) => setEnableTable(e.target.checked)}
                      className="h-4 w-4 accent-[#c8ff3d]"
                    />
                    <Table2 className="h-3.5 w-3.5" />
                    <span>Include GEO Comparison Matrix Table (High LLM Citation Probability)</span>
                  </label>
                  {enableTable && (
                    <button
                      type="button"
                      onClick={() =>
                        setTableRows((prev) => [...prev, ['New Criterion', 'Before', 'After']])
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--cyan)]/40 px-3 py-1 font-mono text-[10px] font-bold text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-[#060608] cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Row</span>
                    </button>
                  )}
                </div>

                {enableTable && (
                  <div className="space-y-3 pt-2">
                    <input
                      type="text"
                      value={tableCaption}
                      onChange={(e) => setTableCaption(e.target.value)}
                      placeholder="Table Caption..."
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--page-text)]"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {tableHeaders.map((h, i) => (
                        <input
                          key={i}
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTableHeaders((prev) =>
                              prev.map((col, cIdx) => (cIdx === i ? val : col))
                            );
                          }}
                          className="rounded-lg border border-[var(--acid)]/35 bg-[var(--surface)] px-2.5 py-1.5 font-mono text-[10.5px] font-bold text-[var(--acid)]"
                        />
                      ))}
                    </div>
                    {tableRows.map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-12 items-center gap-2">
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
                            className="col-span-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--page-text)]"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
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
                  <div
                    key={idx}
                    className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3"
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
                        placeholder={`Question #${idx + 1} (e.g. How do you prevent OAuth token race conditions?)`}
                        className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2 text-xs font-bold text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                      />
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== idx))}
                          className="rounded-lg border border-[var(--line)] p-2 text-red-400 hover:border-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
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
                      placeholder="Direct authoritative technical answer..."
                      className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-card)] px-3 py-2 text-xs text-[var(--text-soft)] focus:border-[var(--acid)] focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Optional Custom SEO Meta Overrides */}
              <details className="rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-4">
                <summary className="cursor-pointer font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--text-soft)]">
                  Advanced SEO Overrides (Custom Meta Title, Meta Description &amp; Canonical URL)
                </summary>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Custom <title> override (defaults to Article Headline)"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-xs text-[var(--page-text)]"
                  />
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Custom meta description override (defaults to TL;DR / Excerpt)"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-xs text-[var(--page-text)]"
                  />
                  <input
                    type="url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="Custom Canonical URL (defaults to https://hariskhandurrani.com/blog/[slug])"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 font-mono text-xs text-[var(--page-text)]"
                  />
                </div>
              </details>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--acid)] py-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#060608] shadow-[0_10px_30px_var(--acid-glow)] transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>
                  {saving
                    ? 'Saving & Indexing...'
                    : editingSlug
                      ? 'Update Article in MySQL & Re-Index SEO/AEO/GEO'
                      : 'Publish New Article (MySQL + SEO/AEO/GEO)'}
                </span>
              </button>
            </form>

            {/* Right Sidebar: Live Score + Quick Post Switcher (4 cols) */}
            <div className="space-y-6 lg:col-span-4">
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
                      <span
                        className={c.passed ? 'text-[var(--page-text)]' : 'text-[var(--text-faint)]'}
                      >
                        <strong className="font-mono text-[10px]">[{c.pillar}]</strong> {c.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Article Switcher */}
              <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                    Quick Edit Articles ({posts.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('articles')}
                    className="font-mono text-[10px] text-[var(--cyan)] hover:underline cursor-pointer"
                  >
                    Full Manager →
                  </button>
                </div>

                <div className="max-h-[460px] space-y-2.5 overflow-y-auto pr-1">
                  {posts.map((post) => (
                    <div
                      key={post.slug}
                      className={cn(
                        'rounded-2xl border p-3.5 transition-colors',
                        editingSlug === post.slug
                          ? 'border-[var(--acid)] bg-[var(--acid)]/[0.06]'
                          : 'border-[var(--line)] bg-[var(--surface-card)]'
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between font-mono text-[9.5px]">
                        <span className="uppercase text-[var(--acid)]">{post.category}</span>
                        <span
                          className={
                            post.published ? 'text-emerald-400' : 'text-amber-300'
                          }
                        >
                          {post.published ? '● LIVE' : '○ DRAFT'}
                        </span>
                      </div>
                      <div className="mb-2.5 line-clamp-2 text-xs font-extrabold text-[var(--page-text)]">
                        {post.title}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
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
                            onClick={() => void handleDeletePost(post.slug, post.title)}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-2.5 py-1 font-mono text-[10px] text-red-400 hover:border-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[var(--acid)]"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: MANAGE ALL ARTICLES (BULK & 1-CLICK LIFECYCLE ACTIONS)
            ===================================================================== */}
        {activeTab === 'articles' && (
          <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                  ARTICLE REPOSITORY
                </span>
                <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em]">
                  Manage All Blog Posts ({posts.length})
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type="search"
                    value={articleFilterQuery}
                    onChange={(e) => setArticleFilterQuery(e.target.value)}
                    placeholder="Filter by title, slug..."
                    className="w-full rounded-full border border-[var(--line)] bg-[var(--surface-card)] py-2 pl-9 pr-4 font-mono text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={resetFormToNew}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-4 py-2 font-mono text-[10.5px] font-black uppercase tracking-[0.1em] text-[#060608] cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Write New Post</span>
                </button>
              </div>
            </div>

            {loading ? (
              <p className="font-mono text-xs text-[var(--text-faint)]">Loading articles...</p>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-5 lg:flex-row lg:items-center"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5 font-mono text-[10px]">
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
                        <span className="text-[var(--text-faint)]">/blog/{post.slug}</span>
                      </div>

                      <h3 className="m-0 text-lg font-extrabold text-[var(--page-text)]">
                        {post.title}
                      </h3>

                      <p className="m-0 line-clamp-2 text-xs text-[var(--text-soft)]">
                        {post.tldrAnswer}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadPostForEdit(post)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-3.5 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] text-[#060608] cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleTogglePostFlag(post.slug, 'published', !post.published)
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[10px] font-bold text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--page-text)] cursor-pointer"
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
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[10px] font-bold text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
                      >
                        <Star
                          className={cn(
                            'h-3.5 w-3.5',
                            post.featured && 'fill-[var(--acid)] text-[var(--acid)]'
                          )}
                        />
                        <span>{post.featured ? 'Unfeature' : 'Feature'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicatePost(post)}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[10px] text-[var(--text-soft)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Duplicate</span>
                      </button>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[10px] font-bold text-[var(--acid)]"
                      >
                        <span>View</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => void handleDeletePost(post.slug, post.title)}
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-[10px] font-bold text-red-400 hover:border-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
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
          <div className="space-y-8">
            {/* Upload Dropzone Card */}
            <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8">
              <div className="mb-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                  SERVER MEDIA STORAGE (/public/uploads/ + MySQL blog_media)
                </span>
                <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em]">
                  Upload Images, Diagrams &amp; Documents to Server
                </h2>
              </div>

              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                  <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                    SEO Image Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={uploadAltText}
                    onChange={(e) => setUploadAltText(e.target.value)}
                    placeholder="e.g. GoHighLevel OAuth 2.0 multi-tenant architecture diagram"
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-xs text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-7">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.avif,.gif,.svg,.pdf,.mp4"
                    onChange={(e) => handleFileInputChange(e, false)}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) void uploadMediaFile(file, false);
                    }}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--acid)]/45 bg-[var(--acid)]/[0.04] p-6 text-center transition-colors hover:bg-[var(--acid)]/[0.09]"
                  >
                    <UploadCloud className="mb-2 h-7 w-7 text-[var(--acid)]" />
                    <span className="font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--page-text)]">
                      {uploading
                        ? 'Uploading to Server...'
                        : 'Click or Drag & Drop File to Upload to Server'}
                    </span>
                    <span className="mt-1 font-mono text-[10px] text-[var(--text-faint)]">
                      Supports JPG, PNG, WebP, AVIF, GIF, SVG, PDF, MP4 (Max 15MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Gallery Grid */}
            <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_26px_70px_var(--shadow)] sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
                  Server Media Assets ({mediaList.length} files)
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {mediaList.map((asset) => {
                  const isImage = asset.mimeType.startsWith('image/');
                  const isCurrentCover = coverImage === asset.url;

                  return (
                    <div
                      key={asset.id}
                      className={cn(
                        'flex flex-col justify-between overflow-hidden rounded-2xl border bg-[var(--surface-card)]',
                        isCurrentCover ? 'border-[var(--acid)]' : 'border-[var(--line)]'
                      )}
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
                          <span
                            className={cn(
                              'absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase',
                              asset.source === 'uploaded'
                                ? 'bg-[var(--acid)] text-[#060608]'
                                : 'bg-black/80 text-white/80'
                            )}
                          >
                            {asset.source === 'uploaded' ? 'Uploaded' : 'Built-In'}
                          </span>
                        </div>

                        <div className="p-3.5">
                          <div
                            title={asset.filename}
                            className="truncate font-mono text-xs font-bold text-[var(--page-text)]"
                          >
                            {asset.filename}
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-[var(--text-faint)]">
                            {formatBytes(asset.sizeBytes)} · {asset.url}
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
                              text: `Selected "${asset.filename}" as article cover image.`,
                            });
                          }}
                          className="rounded-lg bg-[var(--acid)] px-2.5 py-1 font-mono text-[9.5px] font-black uppercase text-[#060608] cursor-pointer"
                        >
                          Use as Cover
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInsertMediaIntoArticle(asset)}
                          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[9.5px] font-bold text-[var(--cyan)] hover:border-[var(--cyan)] cursor-pointer"
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
                          className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2 py-1 font-mono text-[9.5px] text-[var(--text-soft)] hover:text-[var(--page-text)] cursor-pointer"
                        >
                          {copiedMediaUrl === asset.url ? (
                            <Check className="h-3 w-3 text-[var(--acid)]" />
                          ) : (
                            'Copy URL'
                          )}
                        </button>

                        {asset.source === 'uploaded' && (
                          <button
                            type="button"
                            onClick={() => void handleDeleteMedia(asset.filename)}
                            className="ml-auto rounded-lg border border-red-500/30 p-1 text-red-400 hover:border-red-400 cursor-pointer"
                            title="Delete from server"
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
