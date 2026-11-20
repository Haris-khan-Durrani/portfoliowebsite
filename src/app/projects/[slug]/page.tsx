import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Lock } from 'lucide-react';
import { getProjectBySlug, PROJECTS, SITE_CONFIG } from '@/data/portfolio';
import { ProjectJsonLd } from '@/components/seo/JsonLd';
import { Footer } from '@/components/sections/Footer';

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Blueprint Not Found' };

  return {
    title: `${project.title} — System Architecture Blueprint`,
    description: `${project.summary} Role: ${project.blueprint.role} Outcome: ${project.blueprint.outcome}`,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.blueprint.title} | ${SITE_CONFIG.name}`,
      description: project.summary,
      url: `${SITE_CONFIG.url}/projects/${project.slug}`,
      type: 'article',
      ...(project.image ? { images: [{ url: project.image, alt: project.title }] } : {}),
    },
  };
}

export default async function ProjectBlueprintPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--page-text)]">
      <ProjectJsonLd project={project} />

      <div className="arch-grid-bg" aria-hidden="true" />

      {/* Top Sticky Return Bar */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--page-text)] transition-colors hover:text-[var(--acid)]"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--acid)]" />
            <span>Back to All 12 Systems</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--acid)]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--acid)]/40 bg-[var(--acid)]/10 text-[10px]">
              HKD
            </span>
            <span className="hidden sm:inline">{SITE_CONFIG.name}</span>
          </Link>
        </div>
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-[1160px] px-5 py-12 sm:px-8 sm:py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 font-mono text-[11px] text-[var(--text-faint)]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[var(--acid)]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/#work" className="hover:text-[var(--acid)]">
                Systems
              </Link>
            </li>
            <li>/</li>
            <li className="text-[var(--acid)]">{project.shortTitle}</li>
          </ol>
        </nav>

        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
          {project.blueprint.category}
        </div>

        <h1 className="m-0 text-[clamp(30px,5vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.045em] text-[var(--page-text)]">
          {project.blueprint.title}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-soft)] sm:text-lg">
          {project.summary}
        </p>

        {/* Role & Action Strip */}
        <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 md:flex-row md:items-center">
          <div>
            <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
              ENGINEERING ROLE
            </div>
            <p className="m-0 text-sm font-semibold text-[var(--page-text)]">
              {project.blueprint.role}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--acid)] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#060608]"
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
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--page-text)] hover:border-[var(--acid)] hover:text-[var(--acid)]"
              >
                <Github className="h-3.5 w-3.5" />
                <span>View on GitHub</span>
              </a>
            )}
            {!project.liveUrl && !project.githubUrl && project.privateLabel && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-4 py-2 font-mono text-[11px] text-[var(--text-faint)]">
                <Lock className="h-3.5 w-3.5" />
                {project.privateLabel}
              </span>
            )}
          </div>
        </div>

        {/* High-res Interface Visual */}
        {project.image && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-[var(--line)] bg-[#07080d] shadow-[0_28px_80px_var(--shadow)]">
            <Image
              src={project.image}
              alt={`${project.blueprint.title} production interface`}
              fill
              priority
              sizes="(max-width: 1160px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
        )}

        {/* Blueprint 5-Section Specification */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <section className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
            <h2 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
              01 / The Architectural Problem
            </h2>
            <p className="m-0 text-sm leading-[1.75] text-[var(--text-soft)]">
              {project.blueprint.problem}
            </p>

            <h2 className="mb-3 mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
              02 / System Flow &amp; Lifecycle
            </h2>
            <ul className="m-0 list-disc space-y-2.5 pl-5 text-sm leading-[1.7] text-[var(--text-soft)]">
              {project.blueprint.flow.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-6 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
            <div>
              <h2 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                03 / Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.blueprint.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--page-text)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                04 / Engineering Decisions &amp; Tradeoffs
              </h2>
              <ul className="m-0 list-disc space-y-2.5 pl-5 text-sm leading-[1.7] text-[var(--text-soft)]">
                {project.blueprint.decisions.map((decision, idx) => (
                  <li key={idx}>{decision}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--acid)]/35 bg-[var(--acid)]/[0.07] p-5">
              <h2 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
                05 / Measurable Production Value
              </h2>
              <p className="m-0 text-sm font-semibold leading-[1.7] text-[var(--page-text)]">
                {project.blueprint.outcome}
              </p>
            </div>
          </section>
        </div>

        {/* Next / Prev System Navigation */}
        <nav
          aria-label="Adjacent system blueprints"
          className="mt-12 grid grid-cols-1 gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2"
        >
          <Link
            href={`/projects/${prevProject.slug}`}
            className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--acid)]"
          >
            <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              <ArrowLeft className="h-3.5 w-3.5 text-[var(--acid)]" />
              <span>Previous System</span>
            </div>
            <div className="text-base font-extrabold uppercase text-[var(--page-text)] group-hover:text-[var(--acid)]">
              {prevProject.title}
            </div>
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition-colors hover:border-[var(--acid)] sm:text-right"
          >
            <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              <span>Next System</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--acid)]" />
            </div>
            <div className="text-base font-extrabold uppercase text-[var(--page-text)] group-hover:text-[var(--acid)]">
              {nextProject.title}
            </div>
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
}
