// Edge-compatible Auth.js config — used by middleware (Edge runtime).
// Pure config only, no DB adapter (the adapter pulls in Node.js dependencies).
// See auth.ts for the full Node.js-runtime config.

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt', // Required for Edge middleware compatibility
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPortfolioRoute = nextUrl.pathname.startsWith('/portfolio');
      const isAccountRoute = nextUrl.pathname.startsWith('/account');

      if (isPortfolioRoute || isAccountRoute) {
        // Require auth for portfolio + account routes
        if (isLoggedIn) return true;
        const loginUrl = new URL('/login', nextUrl);
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return Response.redirect(loginUrl);
      }
      return true;
    },
    jwt({ token, user }) {
      // On sign-in, copy user id into the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // Expose user.id in the client session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // Filled in auth.ts (Node runtime only)
} satisfies NextAuthConfig;
