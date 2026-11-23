import fs from 'node:fs';
import path from 'node:path';
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import {
  INITIAL_BLOG_POSTS,
  type BlogComparisonTable,
  type BlogFaqItem,
  type BlogPost,
} from '@/data/blog-seed';

declare global {
  // eslint-disable-next-line no-var
  var __hkdMysqlPool: Pool | null | undefined;
  // eslint-disable-next-line no-var
  var __hkdMysqlReady: boolean | undefined;
}

const LOCAL_JSON_PATH = path.join(process.cwd(), 'data', 'blog-posts.json');

function hasMysqlConfig(): boolean {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.MYSQL_HOST ||
      process.env.MYSQL_DATABASE ||
      process.env.MYSQL_USER
  );
}

export function getMysqlPool(): Pool | null {
  if (!hasMysqlConfig()) return null;
  if (global.__hkdMysqlPool !== undefined) return global.__hkdMysqlPool;

  try {
    if (process.env.DATABASE_URL) {
      global.__hkdMysqlPool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 3500,
      });
    } else {
      global.__hkdMysqlPool = mysql.createPool({
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'hkd_portfolio',
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 3500,
      });
    }
    return global.__hkdMysqlPool;
  } catch {
    global.__hkdMysqlPool = null;
    return null;
  }
}

function parseJsonColumn<T>(val: unknown, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val as T;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function mapRowToPost(row: RowDataPacket): BlogPost {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: String(row.subtitle || ''),
    excerpt: String(row.excerpt),
    tldrAnswer: String(row.tldr_answer),
    content: String(row.content),
    category: String(row.category || 'Solution Architecture'),
    coverImage: String(row.cover_image || '/assets/proposal.jpg'),
    readingTimeMinutes: Number(row.reading_time_minutes || 6),
    tags: parseJsonColumn<string[]>(row.tags, []),
    keyTakeaways: parseJsonColumn<string[]>(row.key_takeaways, []),
    faqs: parseJsonColumn<BlogFaqItem[]>(row.faqs, []),
    comparisonTable: parseJsonColumn<BlogComparisonTable | undefined>(
      row.comparison_table,
      undefined
    ),
    geoEntities: parseJsonColumn<string[]>(row.geo_entities, []),
    metaTitle: row.meta_title ? String(row.meta_title) : undefined,
    metaDescription: row.meta_description ? String(row.meta_description) : undefined,
    canonicalUrl: row.canonical_url ? String(row.canonical_url) : undefined,
    authorName: String(row.author_name || 'Haris Khan Durrani'),
    authorRole: String(
      row.author_role || 'Head of IT | Senior Full-Stack Developer | Solution Architect'
    ),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    viewsCount: Number(row.views_count || 0),
    publishedAt: new Date(row.published_at || Date.now()).toISOString(),
    updatedAt: new Date(row.updated_at || Date.now()).toISOString(),
  };
}

async function ensureMysqlInitialized(pool: Pool): Promise<boolean> {
  if (global.__hkdMysqlReady) return true;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        slug VARCHAR(190) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(320) DEFAULT NULL,
        excerpt TEXT NOT NULL,
        tldr_answer TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Solution Architecture',
        cover_image VARCHAR(255) DEFAULT '/assets/proposal.jpg',
        reading_time_minutes INT UNSIGNED NOT NULL DEFAULT 6,
        tags JSON NOT NULL,
        key_takeaways JSON NOT NULL,
        faqs JSON NOT NULL,
        comparison_table JSON DEFAULT NULL,
        geo_entities JSON DEFAULT NULL,
        meta_title VARCHAR(255) DEFAULT NULL,
        meta_description VARCHAR(320) DEFAULT NULL,
        canonical_url VARCHAR(255) DEFAULT NULL,
        author_name VARCHAR(120) NOT NULL DEFAULT 'Haris Khan Durrani',
        author_role VARCHAR(180) NOT NULL DEFAULT 'Head of IT | Senior Full-Stack Developer | Solution Architect',
        featured TINYINT(1) NOT NULL DEFAULT 0,
        published TINYINT(1) NOT NULL DEFAULT 1,
        views_count INT UNSIGNED NOT NULL DEFAULT 0,
        published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_blog_posts_slug (slug),
        KEY idx_blog_posts_category (category),
        KEY idx_blog_posts_published (published, published_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS cnt FROM blog_posts');
    const count = Number(rows[0]?.cnt || 0);

    if (count === 0) {
      for (const post of INITIAL_BLOG_POSTS) {
        await pool.query(
          `INSERT IGNORE INTO blog_posts (
            slug, title, subtitle, excerpt, tldr_answer, content, category, cover_image,
            reading_time_minutes, tags, key_takeaways, faqs, comparison_table, geo_entities,
            meta_title, meta_description, author_name, author_role, featured, published,
            views_count, published_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.slug,
            post.title,
            post.subtitle,
            post.excerpt,
            post.tldrAnswer,
            post.content,
            post.category,
            post.coverImage,
            post.readingTimeMinutes,
            JSON.stringify(post.tags),
            JSON.stringify(post.keyTakeaways),
            JSON.stringify(post.faqs),
            post.comparisonTable ? JSON.stringify(post.comparisonTable) : null,
            JSON.stringify(post.geoEntities),
            post.metaTitle || null,
            post.metaDescription || null,
            post.authorName,
            post.authorRole,
            post.featured ? 1 : 0,
            post.published ? 1 : 0,
            post.viewsCount,
            new Date(post.publishedAt),
            new Date(post.updatedAt),
          ]
        );
      }
    }

    global.__hkdMysqlReady = true;
    return true;
  } catch {
    return false;
  }
}

// Local JSON fallback store when MySQL server is not configured or offline
function readLocalPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(LOCAL_JSON_PATH)) {
      const dir = path.dirname(LOCAL_JSON_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(LOCAL_JSON_PATH, JSON.stringify(INITIAL_BLOG_POSTS, null, 2), 'utf8');
      return [...INITIAL_BLOG_POSTS];
    }
    const raw = fs.readFileSync(LOCAL_JSON_PATH, 'utf8');
    const parsed = JSON.parse(raw) as BlogPost[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_BLOG_POSTS];
  } catch {
    return [...INITIAL_BLOG_POSTS];
  }
}

function writeLocalPosts(posts: BlogPost[]): void {
  try {
    const dir = path.dirname(LOCAL_JSON_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_JSON_PATH, JSON.stringify(posts, null, 2), 'utf8');
  } catch {
    // Ignore write error in read-only edge environments
  }
}

export async function getStorageEngineStatus(): Promise<{
  engine: 'mysql' | 'json-fallback';
  connected: boolean;
  database: string;
}> {
  const pool = getMysqlPool();
  if (pool && (await ensureMysqlInitialized(pool))) {
    return {
      engine: 'mysql',
      connected: true,
      database: process.env.MYSQL_DATABASE || 'hkd_portfolio',
    };
  }
  return {
    engine: 'json-fallback',
    connected: false,
    database: 'data/blog-posts.json (MySQL-ready fallback)',
  };
}

export async function getAllBlogPosts(options?: {
  category?: string;
  query?: string;
  includeDrafts?: boolean;
}): Promise<BlogPost[]> {
  const pool = getMysqlPool();
  if (pool && (await ensureMysqlInitialized(pool))) {
    try {
      const conditions: string[] = [];
      const params: (string | number)[] = [];

      if (!options?.includeDrafts) {
        conditions.push('published = 1');
      }
      if (options?.category && options.category !== 'all') {
        conditions.push('category = ?');
        params.push(options.category);
      }
      if (options?.query?.trim()) {
        const q = `%${options.query.trim()}%`;
        conditions.push('(title LIKE ? OR excerpt LIKE ? OR tldr_answer LIKE ? OR content LIKE ?)');
        params.push(q, q, q, q);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM blog_posts ${whereClause} ORDER BY featured DESC, published_at DESC`,
        params
      );
      return rows.map(mapRowToPost);
    } catch {
      // Fall back cleanly if query fails
    }
  }

  let posts = readLocalPosts();
  if (!options?.includeDrafts) {
    posts = posts.filter((p) => p.published);
  }
  if (options?.category && options.category !== 'all') {
    posts = posts.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
  }
  if (options?.query?.trim()) {
    const q = options.query.trim().toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tldrAnswer.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return posts.sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const pool = getMysqlPool();
  if (pool && (await ensureMysqlInitialized(pool))) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM blog_posts WHERE slug = ? LIMIT 1',
        [slug]
      );
      if (rows[0]) return mapRowToPost(rows[0]);
      return null;
    } catch {
      // Fall through to local store
    }
  }

  const posts = readLocalPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function upsertBlogPost(
  input: Omit<BlogPost, 'id' | 'viewsCount' | 'publishedAt' | 'updatedAt'> & {
    id?: number;
    publishedAt?: string;
  }
): Promise<{ post: BlogPost; engine: 'mysql' | 'json-fallback' }> {
  const nowIso = new Date().toISOString();
  const publishedIso = input.publishedAt || nowIso;

  const pool = getMysqlPool();
  if (pool && (await ensureMysqlInitialized(pool))) {
    try {
      await pool.query(
        `INSERT INTO blog_posts (
          slug, title, subtitle, excerpt, tldr_answer, content, category, cover_image,
          reading_time_minutes, tags, key_takeaways, faqs, comparison_table, geo_entities,
          meta_title, meta_description, canonical_url, author_name, author_role,
          featured, published, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          subtitle = VALUES(subtitle),
          excerpt = VALUES(excerpt),
          tldr_answer = VALUES(tldr_answer),
          content = VALUES(content),
          category = VALUES(category),
          cover_image = VALUES(cover_image),
          reading_time_minutes = VALUES(reading_time_minutes),
          tags = VALUES(tags),
          key_takeaways = VALUES(key_takeaways),
          faqs = VALUES(faqs),
          comparison_table = VALUES(comparison_table),
          geo_entities = VALUES(geo_entities),
          meta_title = VALUES(meta_title),
          meta_description = VALUES(meta_description),
          canonical_url = VALUES(canonical_url),
          featured = VALUES(featured),
          published = VALUES(published),
          updated_at = CURRENT_TIMESTAMP`,
        [
          input.slug,
          input.title,
          input.subtitle,
          input.excerpt,
          input.tldrAnswer,
          input.content,
          input.category,
          input.coverImage,
          input.readingTimeMinutes,
          JSON.stringify(input.tags),
          JSON.stringify(input.keyTakeaways),
          JSON.stringify(input.faqs),
          input.comparisonTable ? JSON.stringify(input.comparisonTable) : null,
          JSON.stringify(input.geoEntities),
          input.metaTitle || null,
          input.metaDescription || null,
          input.canonicalUrl || null,
          input.authorName,
          input.authorRole,
          input.featured ? 1 : 0,
          input.published ? 1 : 0,
          new Date(publishedIso),
        ]
      );

      const saved = await getBlogPostBySlug(input.slug);
      if (saved) return { post: saved, engine: 'mysql' };
    } catch {
      // Fall through to local persistence
    }
  }

  const posts = readLocalPosts();
  const existingIdx = posts.findIndex((p) => p.slug === input.slug);
  const nextId =
    existingIdx >= 0
      ? posts[existingIdx].id
      : posts.reduce((max, p) => Math.max(max, p.id), 0) + 1;

  const savedPost: BlogPost = {
    ...input,
    id: nextId,
    viewsCount: existingIdx >= 0 ? posts[existingIdx].viewsCount : 1,
    publishedAt: existingIdx >= 0 ? posts[existingIdx].publishedAt : publishedIso,
    updatedAt: nowIso,
  };

  if (existingIdx >= 0) {
    posts[existingIdx] = savedPost;
  } else {
    posts.unshift(savedPost);
  }
  writeLocalPosts(posts);
  return { post: savedPost, engine: 'json-fallback' };
}

export async function deleteBlogPostBySlug(slug: string): Promise<boolean> {
  const pool = getMysqlPool();
  if (pool && (await ensureMysqlInitialized(pool))) {
    try {
      await pool.query('DELETE FROM blog_posts WHERE slug = ?', [slug]);
    } catch {
      // Also remove from local fallback if present
    }
  }
  const posts = readLocalPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length !== posts.length) {
    writeLocalPosts(filtered);
    return true;
  }
  return true;
}

export function evaluateSeoAeoGeoScore(post: Partial<BlogPost>): {
  total: number;
  seo: number;
  aeo: number;
  geo: number;
  checks: { label: string; passed: boolean; pillar: 'SEO' | 'AEO' | 'GEO' }[];
} {
  const tldrWords = (post.tldrAnswer || '').trim().split(/\s+/).filter(Boolean).length;
  const contentWords = (post.content || '').trim().split(/\s+/).filter(Boolean).length;

  const checks: { label: string; passed: boolean; pillar: 'SEO' | 'AEO' | 'GEO' }[] = [
    {
      pillar: 'SEO',
      label: 'Keyword-rich title (45–110 chars) & clean URL slug',
      passed: Boolean(post.title && post.title.length >= 35 && post.slug && post.slug.length >= 10),
    },
    {
      pillar: 'SEO',
      label: 'Meta description / excerpt (110–300 chars) & 4+ topic tags',
      passed: Boolean(
        post.excerpt && post.excerpt.length >= 90 && (post.tags?.length || 0) >= 4
      ),
    },
    {
      pillar: 'AEO',
      label: 'TL;DR Direct Answer block (35–85 words for Featured Snippets & Voice)',
      passed: tldrWords >= 30 && tldrWords <= 95,
    },
    {
      pillar: 'AEO',
      label: 'Structured FAQPage Q&A pairs (2+ explicit questions & answers)',
      passed: (post.faqs?.length || 0) >= 2,
    },
    {
      pillar: 'GEO',
      label: 'Quantitative Key Takeaways (3+ verifiable fact bullets for LLM citations)',
      passed: (post.keyTakeaways?.length || 0) >= 3,
    },
    {
      pillar: 'GEO',
      label: 'Named Knowledge Graph Entities & Long-form depth (250+ words)',
      passed: (post.geoEntities?.length || 0) >= 3 && contentWords >= 180,
    },
  ];

  const seoChecks = checks.filter((c) => c.pillar === 'SEO');
  const aeoChecks = checks.filter((c) => c.pillar === 'AEO');
  const geoChecks = checks.filter((c) => c.pillar === 'GEO');

  const seo = Math.round((seoChecks.filter((c) => c.passed).length / seoChecks.length) * 100);
  const aeo = Math.round((aeoChecks.filter((c) => c.passed).length / aeoChecks.length) * 100);
  const geo = Math.round((geoChecks.filter((c) => c.passed).length / geoChecks.length) * 100);
  const total = Math.round((seo + aeo + geo) / 3);

  return { total, seo, aeo, geo, checks };
}
