import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'hkd_admin_session';

function getAuthSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.BLOG_ADMIN_KEY ||
    'hkd-portfolio-hmac-secret-2026-dubai'
  );
}

export function getExpectedAdminCredentials(): {
  email: string;
  username: string;
  password: string;
} {
  return {
    email: (process.env.ADMIN_EMAIL || 'haris.khan5117@gmail.com').toLowerCase().trim(),
    username: (process.env.ADMIN_USERNAME || 'haris').toLowerCase().trim(),
    password: process.env.ADMIN_PASSWORD || process.env.BLOG_ADMIN_KEY || 'HKD-Architect-2026!',
  };
}

export function createAdminSessionToken(identifier: string): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = `${identifier}|${expiresAt}`;
  const hmac = crypto
    .createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}|${hmac}`).toString('base64url');
}

export function verifyAdminSessionToken(token?: string | null): {
  valid: boolean;
  user?: string;
} {
  if (!token) return { valid: false };
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [user, expiresStr, signature] = decoded.split('|');
    if (!user || !expiresStr || !signature) return { valid: false };

    const expiresAt = Number(expiresStr);
    if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false };
    }

    const payload = `${user}|${expiresStr}`;
    const expectedHmac = crypto
      .createHmac('sha256', getAuthSecret())
      .update(payload)
      .digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expectedHmac, 'hex');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false };
    }

    return { valid: true, user };
  } catch {
    return { valid: false };
  }
}

export async function isRequestAdminAuthenticated(request?: Request): Promise<{
  authenticated: boolean;
  user?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const verified = verifyAdminSessionToken(cookieToken);
    if (verified.valid) {
      return { authenticated: true, user: verified.user };
    }
  } catch {
    // Fallback to header check
  }

  if (request) {
    const headerKey = request.headers.get('x-admin-key');
    const { password } = getExpectedAdminCredentials();
    if (headerKey && headerKey === password) {
      return { authenticated: true, user: 'api-key-admin' };
    }
  }

  return { authenticated: false };
}
