import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/data/portfolio';

export const runtime = 'nodejs';

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = (body.name || '').trim().slice(0, 120);
    const email = (body.email || '').trim().slice(0, 160);
    const subject = (body.subject || '').trim().slice(0, 200);
    const message = (body.message || '').trim().slice(0, 4000);

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Please include both a subject and your project context.' },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const referenceId = `HKD-${Date.now().toString(36).toUpperCase()}`;
    const fullBody = [
      name ? `From: ${name}` : null,
      email ? `Reply-To: ${email}` : null,
      `Reference: ${referenceId}`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    // Optional webhook forwarding (n8n / GoHighLevel / Slack) when configured in env
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId,
          name,
          email,
          subject,
          message,
          receivedAt: new Date().toISOString(),
          source: SITE_CONFIG.domain,
        }),
      }).catch(() => undefined);
    }

    const mailtoUrl = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
      `[${referenceId}] ${subject}`
    )}&body=${encodeURIComponent(fullBody)}`;

    return NextResponse.json({
      success: true,
      referenceId,
      mailtoUrl,
      message:
        'Dispatch validated on the server. Click "Open in Mail App" below to send immediately or reach Haris on WhatsApp (+971 55 1651588).',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request payload.' },
      { status: 400 }
    );
  }
}
