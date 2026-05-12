// Asset-request DB queries. Scoped helpers same as transactions.

import { db, assetRequests } from '@/db';
import { and, eq, sql, desc } from 'drizzle-orm';

export async function getAssetRequestsForUser(userId: string) {
  return await db
    .select({ ticker: assetRequests.ticker, createdAt: assetRequests.createdAt })
    .from(assetRequests)
    .where(eq(assetRequests.userId, userId))
    .orderBy(desc(assetRequests.createdAt));
}

export async function addAssetRequestForUser(userId: string, ticker: string) {
  const normalized = ticker.trim().toUpperCase();
  if (!normalized) throw new Error('Ticker is required');
  if (!/^[A-Z0-9.\-]{1,12}$/.test(normalized)) {
    throw new Error('Ticker must be 1-12 chars, letters/numbers/dot/dash only');
  }
  await db
    .insert(assetRequests)
    .values({ userId, ticker: normalized })
    .onConflictDoNothing();
  return normalized;
}

export async function removeAssetRequestForUser(userId: string, ticker: string) {
  await db
    .delete(assetRequests)
    .where(
      and(
        eq(assetRequests.userId, userId),
        eq(assetRequests.ticker, ticker.trim().toUpperCase())
      )
    );
}

/** Public leaderboard -- top voted tickers across all users. No userId scope needed. */
export async function getAssetRequestLeaderboard(limit: number = 20) {
  return await db
    .select({
      ticker: assetRequests.ticker,
      count: sql<number>`cast(count(*) as int)`.as('count'),
    })
    .from(assetRequests)
    .groupBy(assetRequests.ticker)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}
