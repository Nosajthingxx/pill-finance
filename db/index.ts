// Drizzle DB client for pill.finance.
// Connects to Vercel Postgres (Neon engine under the hood).
//
// In Server Components, Server Actions, and API routes:
//   import { db } from '@/db';
//   import { users } from '@/db/schema';
//   const result = await db.select().from(users).limit(1);
//
// SECURITY: every query that touches user data must scope by userId.
// Always prefer the helpers in lib/db/* over raw db.* calls in route code.
// See docs/13-user-system-and-portfolio.md "Security model" for the rationale.

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });

// Re-export schema for convenience: `import { db, users, transactions } from '@/db'`
export * from './schema';
