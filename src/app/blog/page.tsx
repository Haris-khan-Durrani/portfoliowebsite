import type { Metadata } from 'next';
import { isRequestAdminAuthenticated } from '@/lib/admin-auth';
import { getAllBlogPosts } from '@/lib/db';
import { SITE_CONFIG } from '@/data/portfolio';
import { BlogListJsonLd } from '@/components/seo/BlogJsonLd';
import { BlogHubClient } from '@/components/blog/BlogHubClient';
import { Footer } from '@/components/sections/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Architecture & Engineering Journal',
  description:
    'Deep production engineering case studies by Haris Khan Durrani (Head of IT & Solution Architect, Dubai) covering GoHighLevel OAuth 2.0, 3CX AI Telephony, Next.js Multi-Tenant ERPs, and PostgreSQL Disaster Recovery.',
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': `${SITE_CONFIG.url}/rss.xml`,
    },
  },
  openGraph: {
    title: `Architecture & Engineering Journal | ${SITE_CONFIG.name}`,
    description:
      'Production architecture case studies and full-stack engineering guides from Dubai.',
    url: `${SITE_CONFIG.url}/blog`,
    type: 'website',
  },
};

export default async function BlogIndexPage() {
  const [posts, auth] = await Promise.all([
    getAllBlogPosts(),
    isRequestAdminAuthenticated(),
  ]);

  return (
    <>
      <BlogListJsonLd posts={posts} />
      <BlogHubClient initialPosts={posts} isAdmin={auth.authenticated} />
      <Footer posts={posts} />
    </>
  );
}
