import { PortfolioShell } from '@/components/PortfolioShell';
import { PortfolioJsonLd } from '@/components/seo/JsonLd';
import { getAllBlogPosts } from '@/lib/db';

// Force dynamic server rendering so the homepage never serves stale cached HTML
// and always reflects newly published MySQL blog posts in real time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const blogPosts = await getAllBlogPosts();

  return (
    <>
      <PortfolioJsonLd />
      <PortfolioShell initialBlogPosts={blogPosts} />
    </>
  );
}
