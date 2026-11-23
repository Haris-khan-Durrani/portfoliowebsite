import { NextResponse } from 'next/server';
import { isRequestAdminAuthenticated } from '@/lib/admin-auth';
import { pingIndexNow } from '@/lib/indexnow';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const auth = await isRequestAdminAuthenticated(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please log in at /blog/login.' },
      { status: 401 }
    );
  }

  let customUrls: string[] | undefined;
  try {
    const body = await request.json();
    if (Array.isArray(body?.urls)) {
      customUrls = body.urls.map(String);
    }
  } catch {
    // Use full site URL list
  }

  const result = await pingIndexNow(customUrls);
  return NextResponse.json({
    success: true,
    ...result,
  });
}
