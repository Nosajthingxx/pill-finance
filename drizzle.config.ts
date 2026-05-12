import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

const migrationUrl =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!migrationUrl) {
  throw new Error(
    'POSTGRES_URL is not set. Make sure .env.local exists with POSTGRES_URL and POSTGRES_URL_NON_POOLING.'
  );
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrationUrl,
  },
  verbose: true,
  strict: true,
});
