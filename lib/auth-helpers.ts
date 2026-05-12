// Auth helpers used by Server Components, Server Actions, and Route Handlers.
// These are the single chokepoint through which any handler should check auth.
//
// SECURITY: never call db.* without going through requireUserId() first to get
// a scoped userId. See docs/13-user-system-and-portfolio.md "Security model".

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * Returns the current session, or null if not authenticated.
 * For Server Components / Server Actions that may render for anon users.
 */
export async function getSession() {
  return await auth();
}

/**
 * Returns the current userId, or throws + redirects to /login if not authenticated.
 * Use this in Server Actions and route handlers that REQUIRE auth.
 *
 * Pattern:
 *   const userId = await requireUserId();
 *   await db.delete(transactions).where(and(
 *     eq(transactions.id, txId),
 *     eq(transactions.userId, userId)  // ALWAYS scope by userId
 *   ));
 */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  return session.user.id;
}

/**
 * Soft check — returns userId or null, no redirect. Useful for Server Components
 * that render different UI for logged-in vs anonymous users.
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
