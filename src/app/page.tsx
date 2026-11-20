import { PortfolioShell } from '@/components/PortfolioShell';
import { PortfolioJsonLd } from '@/components/seo/JsonLd';

export default function HomePage() {
  return (
    <>
      <PortfolioJsonLd />
      <PortfolioShell />
    </>
  );
}
