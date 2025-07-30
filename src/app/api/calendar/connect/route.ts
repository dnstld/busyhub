import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    `${process.env.NEXTAUTH_URL}/api/calendar/callback`
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    include_granted_scopes: true,
    prompt: 'consent',
    state: 'calendar_permission',
    hl: 'en'
  });

  return NextResponse.json({ authUrl });
}