import type { BlogPost } from '@/data/blog-seed';
import { SITE_CONFIG } from '@/data/portfolio';

export function BlogListJsonLd({ posts }: { posts: BlogPost[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
          { '@type': 'ListItem', position: 2, name: 'Architecture & Engineering Blog', item: `${SITE_CONFIG.url}/blog` },
        ],
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_CONFIG.url}/blog#blog`,
        url: `${SITE_CONFIG.url}/blog`,
        name: `${SITE_CONFIG.name} — Enterprise Architecture, SaaS, CRM & AI Telephony Blog`,
        description:
          'Technical case studies, solution architecture blueprints, and production code guides by Haris Khan Durrani (Head of IT & Senior Full-Stack Developer, Dubai).',
        inLanguage: 'en-US',
        author: {
          '@type': 'Person',
          '@id': `${SITE_CONFIG.url}/#person`,
          name: SITE_CONFIG.name,
          jobTitle: SITE_CONFIG.role,
          url: SITE_CONFIG.url,
          sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin],
        },
        blogPost: posts.map((post) => ({
          '@type': 'BlogPosting',
          '@id': `${SITE_CONFIG.url}/blog/${post.slug}#article`,
          headline: post.title,
          description: post.tldrAnswer || post.excerpt,
          url: `${SITE_CONFIG.url}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          articleSection: post.category,
          keywords: post.tags.join(', '),
          image: `${SITE_CONFIG.url}${post.coverImage}`,
          author: {
            '@type': 'Person',
            name: post.authorName,
            url: SITE_CONFIG.url,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogArticleJsonLd({ post }: { post: BlogPost }) {
  const canonical = post.canonicalUrl || `${SITE_CONFIG.url}/blog/${post.slug}`;
  const wordCount = post.content.split(/\s+/).filter(Boolean).length + 120;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_CONFIG.url}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
      ],
    },
    {
      '@type': ['TechArticle', 'BlogPosting'],
      '@id': `${canonical}#article`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      headline: post.title,
      alternativeHeadline: post.subtitle,
      description: post.tldrAnswer,
      abstract: post.tldrAnswer,
      image: [`${SITE_CONFIG.url}${post.coverImage}`, `${SITE_CONFIG.url}/opengraph-image`],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      inLanguage: 'en-US',
      articleSection: post.category,
      keywords: post.tags.join(', '),
      wordCount,
      timeRequired: `PT${post.readingTimeMinutes}M`,
      proficiencyLevel: 'Expert',
      // AEO SpeakableSpecification for Voice Assistants & Google AI Overviews
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['[data-speakable="headline"]', '[data-speakable="tldr"]', '[data-speakable="takeaways"]'],
      },
      // GEO Semantic Knowledge Graph Entities
      about: post.geoEntities.map((entity) => ({
        '@type': 'Thing',
        name: entity,
      })),
      author: {
        '@type': 'Person',
        '@id': `${SITE_CONFIG.url}/#person`,
        name: post.authorName,
        jobTitle: post.authorRole,
        url: SITE_CONFIG.url,
        worksFor: {
          '@type': 'Organization',
          name: SITE_CONFIG.company,
        },
        sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin],
      },
      publisher: {
        '@type': 'Person',
        '@id': `${SITE_CONFIG.url}/#person`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
    },
  ];

  // AEO FAQPage Schema (Directly eligible for Q&A Rich Results & Answer Engines)
  if (post.faqs && post.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
