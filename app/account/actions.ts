'use server';

import { requireUserId } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { signOut } from '@/auth';
import { accountUpdateSchema } from '@/lib/validators';
import {
  updateUserDisplayName,
  softDeleteUser,
  getUserByIdForUser,
} from '@/lib/db/users';
import { getAllTransactionsForUser } from '@/lib/db/transactions';
import { getAssetRequestsForUser } from '@/lib/db/asset-requests';
import type { ActionResult } from '@/app/portfolio/actions';

export async function updateAccountAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = accountUpdateSchema.safeParse({
    displayName: formData.get('displayName'),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid input.',
    };
  }
  await updateUserDisplayName(userId, parsed.data.displayName);
  revalidatePath('/account');
  return { ok: true };
}

/** Soft-delete the account. The user is logged out and has 30 days to recover. */
export async function deleteAccountAction(): Promise<void> {
  const userId = await requireUserId();
  await softDeleteUser(userId);
  await signOut({ redirectTo: '/account/deleted' });
}

/** Returns a JSON export of all user data. Used by the /api/account/export route. */
export async function buildUserExport(userId: string) {
  const [user, transactions, assetRequests] = await Promise.all([
    getUserByIdForUser(userId),
    getAllTransactionsForUser(userId),
    getAssetRequestsForUser(userId),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    schemaVersion: 1,
    profile: user
      ? {
          id: user.id,
          email: user.email,
          displayName: user.name,
          baseCurrency: user.baseCurrency,
          createdAt: user.createdAt,
          deletedAt: user.deletedAt,
        }
      : null,
    transactions: transactions.map((t) => ({
      id: t.id,
      assetSlug: t.assetSlug,
      side: t.side,
      quantity: t.quantity,
      priceUsd: t.priceUsd,
      transactionDate: t.transactionDate,
      note: t.note,
      createdAt: t.createdAt,
    })),
    assetRequests: assetRequests.map((r) => ({
      ticker: r.ticker,
      createdAt: r.createdAt,
    })),
  };
}
