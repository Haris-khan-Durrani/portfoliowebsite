import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getExpectedAdminCredentials,
  isRequestAdminAuthenticated,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const status = await isRequestAdminAuthenticated(request);
  return NextResponse.json({
    authenticated: status.authenticated,
    user: status.user || null,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || body.email || body.username || '')
      .toLowerCase()
      .trim();
    const password = String(body.password || '').trim();

    const expected = getExpectedAdminCredentials();

    const validUser =
      identifier === expected.email ||
      identifier === expected.username ||
      identifier === 'admin';
    const validPass = password === expected.password;

    if (!validUser || !validPass) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid admin credentials. Please check your email/username and password.',
        },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(expected.email);
    const response = NextResponse.json({
      success: true,
      user: expected.email,
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Malformed login request.' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, loggedOut: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
