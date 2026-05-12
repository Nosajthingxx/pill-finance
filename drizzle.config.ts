// Drizzle Kit config — drives `npm run db:generate`, `db:migrate`, `db:studio`.
// Reads DB connection from POSTGRES_URL (set in Vercel Postgres dashboard
// and pulled to .env.local via `vercel env pull`).

import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

// Prefer non-pooled URL for migrations (pgbouncer can interfere with CREATE TYPE
// for enums and other DDL). Fall back to pooled URL if non-pooled is missing.
const migrationUrl =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!migrationUrl) {
  throw new Error(
    'POSTGRES_URL is not set. Make sure .env.local exists with POSTGRES_URL ' +
      'and POSTGRES_URL_NON_POOLING (auto-populated by Vercel Postgres 