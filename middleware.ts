// Edge middleware — runs on every request to protect /portfolio and /account.
// Uses the edge-safe authConfig from auth.config.ts (no DB imports).

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Match all paths except: API routes, Next internals, public files, sitemap, robots, auth pages
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
