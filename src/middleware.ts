import { NextRequest } from 'next/server';
import { updateSession } from './app/lib/session';

export async function middleware(request: NextRequest) {
    const { pathname } = new URL(request.url);

    // Skip public paths
    if (pathname.startsWith('/_next/') || pathname.startsWith('/api/')) return;

    return await updateSession(request);
}