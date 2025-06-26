import { auth } from '@/auth';

export const config = { matcher: ['/dashboard/:path*'] };

export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
});
