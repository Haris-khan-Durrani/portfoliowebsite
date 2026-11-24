import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getUaeSolutionBySlug, UAE_SOLUTIONS } from '@/data/solutions';
import { getProjectBySlug, SITE_CONFIG } from '@/data/portfolio';
import { Footer } from '@/components/sections/Footer';

export function generateStaticParams() {
  return UAE_SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getUaeSolutionBySlug(slug);
  if (!solution) return { title: 'Solution Not Found' };

  return {
    title: solution.metaTitle,
    description: solution.metaDescription,
    keywords: solution.targetKeywords,
    alternates: {
      canonical: `/solutions/${solution.slug}`,
    },
    openGraph: {
      title: solution.metaTitle,
      description: solution.metaDescription,
      url: `${SITE_CONFIG.url}/solutions/${solution.slug}`,
      type: 'website',
    },
  };
}

export default async function UaeSolutionLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getUaeSolutionBySlug(slug);
  if (!solution) notFound();

  const relatedProjects = solution.relatedProjectSlugs
    .map((s) => getProjectBySlug(s))
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
          {
            '@type': 'ListItem',
            position: 2,
            name: solution.shortTitle,
            item: `${SITE_CONFIG.url}/solutions/${solution.slug}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: solution.title,
        description: solution.summary,
        url: `${SITE_CONFIG.url}/solutions/${solution.slug}`,
        provider: {
          '@type': 'Person',
          name: SITE_CONFIG.name,
          jobTitle: SITE_CONFIG.role,
          url: SITE_CONFIG.url,
          telephone: '+971551651588',
          email: SITE_CONFIG.email,
        },
        areaServed: [
          { '@type': 'City', name: 'Dubai' },
          { '@type': 'City', name: 'Abu Dhabi' },
          { '@type': 'City', name: 'Sharjah' },
          { '@type': 'Country', name: 'United Arab Emirates' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: solution.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="arch-grid-bg" aria-hidden="true" />

      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1220px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--page-text)] hover:text-[var(--acid)]"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/tools"
              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-[var(--cyan)] hover:border-[var(--cyan)]"
            >
              ROI &amp; Tax Calculators
            </Link>
            <a
              href={SITE_CONFIG.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--acid)] px-4 py-1.5 font-mono text-[10.5px] font-black uppercase tracking-[0.1em] text-[#060608]"
            >
              Consult in Dubai ↗
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1220px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--acid)]/30 bg-[var(--acid)]/10 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
          <MapPin className="h-3 w-3" />
          <span>Dubai · Abu Dhabi · Sharjah · UAE Enterprise Architecture</span>
        </div>

        <h1 className="m-0 max-w-4xl text-[clamp(32px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.045em]">
          {solution.heroHeadline}{' '}
          <span className="hero-gradient-text font-serif font-normal italic">
            {solution.heroHighlight}
          </span>
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-soft)] sm:text-lg">
          {solution.summary}
        </p>

        {/* Proof Metrics Grid */}
        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {solution.proofMetrics.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <div className="text-2xl font-black text-[var(--acid)] sm:text-3xl">{m.value}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-soft)]">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Pain Points vs Deliverables */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 lg:col-span-5">
            <div className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
              01 / Enterprise Bottlenecks Solved
            </div>
            <h2 className="m-0 mb-5 text-xl font-extrabold">
              Why UAE Companies Call Me
            </h2>
            <ul className="m-0 space-y-4 pl-0 list-none">
              {solution.painPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-soft)]">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-400/15 font-mono text-[10px] font-bold text-amber-300">
                    !
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[26px] border border-[var(--acid)]/35 bg-[var(--surface)] p-6 sm:p-8 lg:col-span-7">
            <div className="mb-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
              02 / Production Deliverables
            </div>
            <h2 className="m-0 mb-5 text-xl font-extrabold">
              What I Architect &amp; Ship for You
            </h2>
            <div className="space-y-4">
              {solution.deliverables.map((d, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-4"
                >
                  <div className="flex items-center gap-2 font-extrabold text-[var(--page-text)]">
                    <CheckCircle2 className="h-4 w-4 text-[var(--acid)]" />
                    <span>{d.title}</span>
                  </div>
                  <p className="m-0 mt-1.5 text-xs leading-relaxed text-[var(--text-soft)]">
                    {d.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Related Live Production Case Studies */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="m-0 text-2xl font-extrabold tracking-[-0.03em]">
              Verified Production Case Studies
            </h2>
            <Link href="/#work" className="font-mono text-xs text-[var(--acid)] hover:underline">
              View All 12 Systems →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {relatedProjects.map((proj) =>
              proj ? (
                <Link
                  key={proj.slug}
                  href={`/projects/${proj.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--acid)]"
                >
                  <div>
                    <div className="mb-1.5 font-mono text-[10px] font-bold uppercase text-[var(--acid)]">
                      {proj.categoryLabel}
                    </div>
                    <h3 className="m-0 mb-2 text-lg font-extrabold text-[var(--page-text)] group-hover:text-[var(--acid)]">
                      {proj.title}
                    </h3>
                    <p className="m-0 line-clamp-3 text-xs leading-relaxed text-[var(--text-soft)]">
                      {proj.summary}
                    </p>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10.5px] font-bold uppercase text-[var(--acid)]">
                    <span>Inspect Blueprint</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ) : null
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--acid)]">
            <HelpCircle className="h-4 w-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <div className="space-y-4">
            {solution.faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface-card)] p-5"
              >
                <h3 className="m-0 mb-2 text-base font-extrabold">{f.question}</h3>
                <p className="m-0 text-sm leading-relaxed text-[var(--text-soft)]">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Direct CTA Banner */}
        <section className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-[var(--acid)]/45 bg-gradient-to-br from-[var(--acid)]/[0.09] via-[var(--surface)] to-[var(--surface)] p-7 sm:p-9 lg:flex-row lg:items-center">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
              <ShieldCheck className="h-4 w-4" />
              <span>Direct Executive Consultation · Dubai, UAE</span>
            </div>
            <h2 className="m-0 text-2xl font-extrabold">
              Ready to architect or consolidate your platform?
            </h2>
            <p className="m-0 mt-1 text-xs text-[var(--text-soft)]">
              Speak directly with {SITE_CONFIG.name} ({SITE_CONFIG.phone} · {SITE_CONFIG.email})
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 font-mono text-xs font-bold uppercase text-[var(--page-text)] hover:border-[var(--acid)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[var(--acid)]" />
              <span>Calculate Your ROI</span>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-6 py-3 font-mono text-xs font-black uppercase text-[#060608]"
            >
              <span>Book Consultation</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Cross-Link Other UAE Solutions */}
        <section className="mt-12 border-t border-[var(--line)] pt-8">
          <div className="mb-4 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--cyan)]">
            <Layers className="h-4 w-4" />
            <span>Explore Other UAE Enterprise Solutions</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {UAE_SOLUTIONS.map((s) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className={`rounded-xl border p-3.5 font-mono text-xs font-bold transition-colors ${
                  s.slug === solution.slug
                    ? 'border-[var(--acid)] bg-[var(--acid)]/10 text-[var(--acid)]'
                    : 'border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)] hover:border-[var(--acid)] hover:text-[var(--page-text)]'
                }`}
              >
                {s.shortTitle} →
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
