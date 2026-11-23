import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2/promise';
import { isRequestAdminAuthenticated } from '@/lib/admin-auth';
import { getMysqlPool } from '@/lib/db';

export const runtime = 'nodejs';

export interface MediaAssetItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  source: 'uploaded' | 'builtin';
  uploadedAt: string;
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const BUILTIN_ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.svg',
  '.pdf',
  '.mp4',
]);

function guessMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.pdf':
      return 'application/pdf';
    case '.mp4':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
}

async function ensureMediaMysqlTable(): Promise<void> {
  const pool = getMysqlPool();
  if (!pool) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_media (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
        alt_text VARCHAR(255) DEFAULT NULL,
        uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_blog_media_filename (filename)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch {
    // Ignore when MySQL is offline
  }
}

function scanDirectoryForMedia(
  dirPath: string,
  urlPrefix: string,
  source: 'uploaded' | 'builtin'
): MediaAssetItem[] {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);
  const items: MediaAssetItem[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) continue;
    const fullPath = path.join(dirPath, file);
    try {
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) continue;
      items.push({
        id: `${source}-${file}`,
        filename: file,
        url: `${urlPrefix}/${file}`,
        mimeType: guessMimeType(ext),
        sizeBytes: stat.size,
        altText: file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
        source,
        uploadedAt: stat.mtime.toISOString(),
      });
    } catch {
      // Ignore unreadable file
    }
  }

  return items.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export async function GET() {
  await ensureMediaMysqlTable();
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const uploaded = scanDirectoryForMedia(UPLOADS_DIR, '/uploads', 'uploaded');
  const builtin = scanDirectoryForMedia(BUILTIN_ASSETS_DIR, '/assets', 'builtin');

  // Enrich with alt_text from MySQL if available
  const pool = getMysqlPool();
  if (pool) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>('SELECT filename, alt_text FROM blog_media');
      const altMap = new Map<string, string>();
      rows.forEach((r) => {
        if (r.filename && r.alt_text) altMap.set(String(r.filename), String(r.alt_text));
      });
      uploaded.forEach((item) => {
        if (altMap.has(item.filename)) item.altText = altMap.get(item.filename)!;
      });
    } catch {
      // Ignore if MySQL query fails
    }
  }

  return NextResponse.json({
    success: true,
    count: uploaded.length + builtin.length,
    media: [...uploaded, ...builtin],
  });
}

export async function POST(request: Request) {
  const auth = await isRequestAdminAuthenticated(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in at /blog/login.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const customAlt = String(formData.get('altText') || '').trim();

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { success: false, error: 'No media file provided.' },
        { status: 400 }
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File exceeds the 15MB upload limit.' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'upload.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type (${ext}). Allowed: JPG, PNG, WebP, AVIF, GIF, SVG, PDF, MP4.`,
        },
        { status: 400 }
      );
    }

    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'media';

    const safeFilename = `${baseName}-${Date.now().toString(36)}${ext}`;
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const destPath = path.join(UPLOADS_DIR, safeFilename);
    fs.writeFileSync(destPath, buffer);

    const url = `/uploads/${safeFilename}`;
    const mimeType = file.type || guessMimeType(ext);
    const altText = customAlt || baseName.replace(/-/g, ' ');

    // Also log in MySQL blog_media if connected
    await ensureMediaMysqlTable();
    const pool = getMysqlPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO blog_media (filename, url, mime_type, size_bytes, alt_text)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE alt_text = VALUES(alt_text)`,
          [safeFilename, url, mimeType, buffer.length, altText]
        );
      } catch {
        // Ignore DB error if MySQL is offline
      }
    }

    const asset: MediaAssetItem = {
      id: `uploaded-${safeFilename}`,
      filename: safeFilename,
      url,
      mimeType,
      sizeBytes: buffer.length,
      altText,
      source: 'uploaded',
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      asset,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Media upload failed.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await isRequestAdminAuthenticated(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in at /blog/login.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const filename = path.basename(String(searchParams.get('filename') || ''));
  if (!filename) {
    return NextResponse.json(
      { success: false, error: 'Filename is required.' },
      { status: 400 }
    );
  }

  const targetPath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }

  const pool = getMysqlPool();
  if (pool) {
    try {
      await pool.query('DELETE FROM blog_media WHERE filename = ?', [filename]);
    } catch {
      // Ignore
    }
  }

  return NextResponse.json({
    success: true,
    deletedFilename: filename,
  });
}
