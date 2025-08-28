import { auth } from '@/auth/next';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    `${process.env.NEXTAUTH_URL}/api/calendar/callback`
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events.readonly'],
    prompt: 'consent',
    state: 'calendar_permission',
    hl: 'en',
    login_hint: session.user.email,
  });

  return NextResponse.json({ authUrl });
}