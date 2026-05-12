'use server';

// Server Actions for portfolio mutations. Every action:
//   1. Calls requireUserId() -- single auth chokepoint
//   2. Validates input with Zod
//   3. For transactions: runs validateTransaction() to reject nonsensical entries
//   4. Calls a scoped lib/db/* helper
//   5. Revalidates affected paths

import { requireUserId } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { transactionInputSchema, assetRequestSchema } from '@/lib/validators';
import {
  createTransactionForUser,
  getAllTransactionsForUser,
  getTransactionByIdForUser,
  updateTransactionForUser,
  deleteTransactionForUser,
} from '@/lib/db/transactions';
import {
  addAssetRequestForUser,
  removeAssetRequestForUser,
} from '@/lib/db/asset-requests';
import { validateTransaction } from '@/lib/portfolio';

// ─── Helper: unified action return type ─────────────────────────────────

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Transactions ───────────────────────────────────────────────────────

function parseTransactionForm(formData: FormData) {
  const raw = {
    assetSlug: formData.get('assetSlug'),
    side: formData.get('side'),
    quantity: formData.get('quantity'),
    priceUsd: formData.get('priceUsd'),
    transactionDate: formData.get('transactionDate'),
    note: formData.get('note'),
  };
  return transactionInputSchema.safeParse(raw);
}

export async function createTransactionAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const userId = await requireUserId();
  const parsed = parseTransactionForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Validate against prior transactions for the same asset
  const all = await getAllTransactionsForUser(userId);
  const validation = validateTransaction(all, parsed.data);
  if (!validation.ok) {
    return { ok: false, error: validation.reason };
  }

  const row = await createTransactionForUser(userId, {
    assetSlug: parsed.data.assetSlug,
    side: parsed.data.side,
    quantity: String(parsed.data.quantity),
    priceUsd: String(parsed.data.priceUsd),
    transactionDate: parsed.data.transactionDate,
    note: parsed.data.note,
  });

  revalidatePath('/portfolio');
  revalidatePath('/portfolio/transactions');
  redirect('/portfolio/transactions');
}

export async function updateTransactionAction(
  txId: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = parseTransactionForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Re-validate against all OTHER transactions (exclude this one being edited)
  const existing = await getTransactionByIdForUser(userId, txId);
  if (!existing) return { ok: false, error: 'Transaction not found.' };

  const others = (await getAllTransactionsForUser(userId)).filter(
    (t) => t.id !== txId
  );
  const validation = validateTransaction(others, parsed.data);
  if (!validation.ok) return { ok: false, error: validation.reason };

  const updated = await updateTransactionForUser(userId, txId, {
    assetSlug: parsed.data.assetSlug,
    side: parsed.data.side,
    quantity: String(parsed.data.quantity),
    priceUsd: String(parsed.data.priceUsd),
    transactionDate: parsed.data.transactionDate,
    note: parsed.data.note,
  });
  if (!updated) return { ok: false, error: 'Transaction not found.' };

  revalidatePath('/portfolio');
  revalidatePath('/portfolio/transactions');
  redirect('/portfolio/transactions');
}

export async function deleteTransactionAction(txId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  const deleted = await deleteTransactionForUser(userId, txId);
  if (!deleted) return { ok: false, error: 'Transaction not found.' };

  revalidatePath('/portfolio');
  revalidatePath('/portfolio/transactions');
  return { ok: true };
}

// ─── Asset requests ─────────────────────────────────────────────────────

export async function addAssetRequestAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = assetRequestSchema.safeParse({
    ticker: formData.get('ticker'),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid ticker.',
    };
  }
  await addAssetRequestForUser(userId, parsed.data.ticker);
  revalidatePath('/portfolio/asset-requests');
  return { ok: true };
}

export async function removeAssetRequestAction(ticker: string): Promise<ActionResult> {
  const userId = await requireUserId();
  await removeAssetRequestForUser(userId, ticker);
  revalidatePath('/portfolio/asset-requests');
  return { ok: true };
}
