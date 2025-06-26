import { NextRequest } from 'next/server';
import { updateSession } from './app/lib/session';

export const config = {
  matcher: [
  '/((?!api|_next/static|_next/image|favicon.ico).*)',
  '/((?!api|_next/static|_next/image|favicon.ico)/.*)',
  ],
};

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered:', request.method, request.url);
  return await updateSession(request);
}