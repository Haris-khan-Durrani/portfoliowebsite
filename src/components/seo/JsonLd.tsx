import { PROJECTS, SITE_CONFIG, SKILLS_ROW_1, SKILLS_ROW_2, type ProjectItem } from '@/data/portfolio';

export function PortfolioJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} — Portfolio`,
        description: SITE_CONFIG.heroDescription,
        inLanguage: 'en-US',
        publisher: {
          '@id': `${SITE_CONFIG.url}/#person`,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_CONFIG.url}/#profilepage`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} — Head of IT | Senior Full-Stack Developer | Solution Architect`,
        isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
        mainEntity: { '@id': `${SITE_CONFIG.url}/#person` },
        dateModified: new Date().toISOString().split('T')[0],
      },
      {
        '@type': 'Person',
        '@id': `${SITE_CONFIG.url}/#person`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        jobTitle: SITE_CONFIG.role,
        description: SITE_CONFIG.heroDescription,
        worksFor: {
          '@type': 'Organization',
          name: SITE_CONFIG.company,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Dubai',
            addressCountry: 'AE',
          },
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Newports Institute of Communication and Economics (NICE)',
          },
          {
            '@type': 'EducationalOrganization',
            name: 'Aptech Computer Education',
          },
          {
            '@type': 'EducationalOrganization',
            name: 'Arena Multimedia',
          },
        ],
        knowsAbout: [...SKILLS_ROW_1, ...SKILLS_ROW_2],
        knowsLanguage: ['English', 'Urdu'],
        telephone: '+971551651588',
        email: `mailto:${SITE_CONFIG.email}`,
        sameAs: [SITE_CONFIG.github, SITE_CONFIG.linkedin],
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_CONFIG.url}/#projects`,
        name: 'Architected & Shipped Production Systems',
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_CONFIG.url}/projects/${project.slug}`,
          item: {
            '@type': 'SoftwareApplication',
            name: project.title,
            applicationCategory: project.categoryLabel,
            operatingSystem: 'Web, Cloud, Linux, Docker',
            description: project.summary,
            author: { '@id': `${SITE_CONFIG.url}/#person` },
            ...(project.liveUrl ? { url: project.liveUrl } : {}),
            ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
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

export function ProjectJsonLd({ project }: { project: ProjectItem }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_CONFIG.url,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Systems',
            item: `${SITE_CONFIG.url}/#work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: `${SITE_CONFIG.url}/projects/${project.slug}`,
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: project.blueprint.title,
        applicationCategory: project.blueprint.category,
        description: project.summary,
        operatingSystem: 'Web, Cloud, Linux, Docker',
        author: {
          '@type': 'Person',
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.url,
        },
        ...(project.image ? { image: `${SITE_CONFIG.url}${project.image}` } : {}),
        ...(project.liveUrl ? { url: project.liveUrl } : {}),
        ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
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
