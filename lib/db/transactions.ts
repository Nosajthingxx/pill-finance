// All transaction DB queries MUST go through these scoped helpers.
// Every function takes userId as its first argument and includes it in WHERE.
// See docs/13-user-system-and-portfolio.md "Security model".

import { db, transactions } from '@/db';
import type { NewTransaction, Transaction, TransactionSide } from '@/db/schema';
import { and, eq, desc, asc } from 'drizzle-orm';

/** Insert a new transaction for a user. */
export async function createTransactionForUser(
  userId: string,
  input: Omit<NewTransaction, 'userId' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> {
  const [row] = await db
    .insert(transactions)
    .values({ ...input, userId })
    .returning();
  return row;
}

/** Fetch a single transaction, scoped by userId — null if not found or not owned. */
export async function getTransactionByIdForUser(
  userId: string,
  txId: string
): Promise<Transaction | null> {
  const rows = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, txId), eq(transactions.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * All of a user's transactions in chronological order.
 * Used by the P/L engine to compute positions.
 */
export async function getAllTransactionsForUser(
  userId: string
): Promise<Transaction[]> {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(asc(transactions.transactionDate), asc(transactions.createdAt));
}

/** Most recent transactions first — for the transaction history page. */
export async function getRecentTransactionsForUser(
  userId: string,
  limit: number = 100
): Promise<Transaction[]> {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
    .limit(limit);
}

/** Update an existing transaction. Returns updated row or null if not owned. */
export async function updateTransactionForUser(
  userId: string,
  txId: string,
  patch: Partial<Omit<NewTransaction, 'userId' | 'id' | 'createdAt'>>
): Promise<Transaction | null> {
  const [row] = await db
    .update(transactions)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(transactions.id, txId), eq(transactions.userId, userId)))
    .returning();
  return row ?? null;
}

/** Delete a transaction. Returns true if deleted, false if not found. */
export async function deleteTransactionForUser(
  userId: string,
  txId: string
): Promise<boolean> {
  const result = await db
    .delete(transactions)
    .where(and(eq(transactions.id, txId), eq(transactions.userId, userId)))
    .returning({ id: transactions.id });
  return result.length > 0;
}
