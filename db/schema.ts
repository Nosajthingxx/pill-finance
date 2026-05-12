// Drizzle schema for pill.finance portfolio tracker.
// Single source of truth for all database tables.
// See docs/13-user-system-and-portfolio.md for the design rationale.

import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  decimal,
  date,
  integer,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// ─── Auth.js managed tables (standard shape per @auth/drizzle-adapter) ──

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  // Auth.js standard columns
  name: text('name'), // Auth.js uses this; we surface it as "displayName" in our UI
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'), // reserved; unused in V1.1
  // Our custom columns
  baseCurrency: text('baseCurrency').default('USD').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  lastLoginAt: timestamp('lastLoginAt', { mode: 'date' }),
  deletedAt: timestamp('deletedAt', { mode: 'date' }), // soft delete; hard-deleted by cron after 30 days
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ─── Portfolio tables ───────────────────────────────────────────────────

export const transactionSide = pgEnum('transaction_side', [
  'buy',
  'sell',
  'short_open',
  'short_close',
]);

/**
 * Source of truth for portfolio state. Positions are NOT stored; they are
 * computed from transactions on the fly by lib/portfolio.ts.
 *
 * Validation rules enforced in app code (not DB):
 *  - assetSlug must be one of the 19 in lib/slugs.ts
 *  - quantity > 0 (direction comes from `side`)
 *  - priceUsd >= 0
 *  - rejecting nonsensical transactions (sell more than owned, short while long, etc.)
 */
export const transactions = pgTable(
  'transaction',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assetSlug: text('assetSlug').notNull(),
    side: transactionSide('side').notNull(),
    // 20 digits total, 8 after the decimal. Enough for FX (5 decimals),
    // crypto (8 decimals), and stocks (2 decimals) within one column.
    quantity: decimal('quantity', { precision: 20, scale: 8 }).notNull(),
    priceUsd: decimal('priceUsd', { precision: 20, scale: 8 }).notNull(),
    // User-entered date (no TZ). Stored as DATE, not TIMESTAMP, to avoid TZ confusion.
    transactionDate: date('transactionDate', { mode: 'string' }).notNull(),
    note: text('note'),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
  },
  (t) => ({
    // Indexes for the two most common queries:
    //  - "all of user X's transactions for asset Y in chronological order"
    //  - "all of user X's transactions ever"
    userAssetDateIdx: index('tx_user_asset_date_idx').on(
      t.userId,
      t.assetSlug,
      t.transactionDate
    ),
    userIdx: index('tx_user_idx').on(t.userId),
  })
);

/**
 * Asset request voting. Users vote for new tickers they want pill.finance to brief.
 * Aggregate counts drive the public leaderboard + the B2B demand-signal export.
 */
export const assetRequests = pgTable(
  'asset_request',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ticker: text('ticker').notNull(), // normalized to uppercase before insert
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  },
  (r) => ({
    // One vote per user per ticker
    userTickerUnique: uniqueIndex('asset_request_user_ticker_unique').on(
      r.userId,
      r.ticker
    ),
    // For the public leaderboard aggregate
    tickerIdx: index('asset_request_ticker_idx').on(r.ticker),
  })
);

// ─── Type exports (for use throughout the app) ──────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type TransactionSide = (typeof transactionSide.enumValues)[number];

export type AssetRequest = typeof assetRequests.$inferSelect;
export type NewAssetRequest = typeof assetRequests.$inferInsert;
