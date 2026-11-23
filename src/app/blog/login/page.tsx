'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/data/portfolio';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('haris.khan5117@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/blog/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch {
      setError('Unable to reach authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[var(--page-bg)] px-5 py-8 text-[var(--page-text)]">
      <div className="arch-grid-bg" aria-hidden="true" />

      {/* Top Return Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1200px] items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-soft)] hover:text-[var(--acid)]"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
          <span>Back to Architecture Journal</span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--page-text)]"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--acid)]/45 bg-[var(--acid)]/15 text-[10px] text-[var(--acid)]">
            HKD
          </span>
          <span className="hidden sm:inline">{SITE_CONFIG.name}</span>
        </Link>
      </header>

      {/* Center Login Card */}
      <main className="relative z-10 mx-auto my-12 w-full max-w-[460px]">
        <div className="conic-beam overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[0_35px_100px_var(--shadow)] sm:p-9">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--acid)]/40 bg-[var(--acid)]/15 text-[var(--acid)] shadow-[0_0_24px_rgba(200,255,61,0.2)]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--acid)]">
                ADMINISTRATION PORTAL
              </div>
              <h1 className="m-0 text-2xl font-extrabold tracking-[-0.03em] text-[var(--page-text)]">
                Blog &amp; Media Studio
              </h1>
            </div>
          </div>

          <p className="mb-6 text-xs leading-relaxed text-[var(--text-soft)]">
            Sign in as <strong className="text-[var(--page-text)]">{SITE_CONFIG.name}</strong> to
            create, edit, or delete MySQL blog articles, upload media assets to the server, and
            manage SEO, AEO &amp; GEO indexing.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-3.5 font-mono text-xs text-red-300"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="adminIdentifier"
                className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]"
              >
                Admin Email or Username
              </label>
              <input
                id="adminIdentifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="haris.khan5117@gmail.com"
                autoComplete="username"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] px-4 py-3 text-sm text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="adminPassword"
                className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-card)] py-3 pl-4 pr-11 text-sm text-[var(--page-text)] focus:border-[var(--acid)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--page-text)] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--acid)] py-3.5 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#060608] shadow-[0_10px_28px_var(--acid-glow)] transition-transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to CMS Studio'}</span>
            </button>
          </form>

          {/* Quick Local Dev Credential Fill Helper */}
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-3.5">
            <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] text-[var(--text-faint)]">
              <span className="inline-flex items-center gap-1.5 text-[var(--acid)]">
                <KeyRound className="h-3 w-3" />
                Default Admin Credentials (.env configurable)
              </span>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('haris.khan5117@gmail.com');
                  setPassword('HKD-Architect-2026!');
                }}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--acid)]/40 bg-[var(--acid)]/10 px-2.5 py-0.5 font-bold text-[var(--acid)] hover:bg-[var(--acid)] hover:text-[#060608] cursor-pointer"
              >
                <Sparkles className="h-2.5 w-2.5" />
                <span>Auto-Fill</span>
              </button>
            </div>
            <div className="font-mono text-[11px] text-[var(--text-soft)]">
              <div>
                Email: <code className="text-[var(--page-text)]">haris.khan5117@gmail.com</code>
              </div>
              <div>
                Pass: <code className="text-[var(--page-text)]">HKD-Architect-2026!</code>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
        HMAC-SHA256 Signed HttpOnly Session · {SITE_CONFIG.domain}
      </footer>
    </div>
  );
}
