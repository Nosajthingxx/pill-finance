// User DB queries -- scoped helpers same pattern as transactions / asset-requests.

import { db, users } from '@/db';
import { and, eq, lt } from 'drizzle-orm';

export async function getUserByIdForUser(userId: string) {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function updateUserDisplayName(userId: string, name: string | null) {
  await db.update(users).set({ name }).where(eq(users.id, userId));
}

export async function softDeleteUser(userId: string) {
  await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function undoSoftDeleteUser(userId: string) {
  await db
    .update(users)
    .set({ deletedAt: null })
    .where(eq(users.id, userId));
}

/** Hard delete: removes the user row and cascades to all owned data. */
export async function hardDeleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
}

/** Find soft-deleted users past the 30-day grace period. */
export async function findExpiredSoftDeletedUsers() {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - 30);
  return await db
    .select({ id: users.id, email: users.email, deletedAt: users.deletedAt })
    .from(users)
    .where(and(lt(users.deletedAt, cutoff)));
}
