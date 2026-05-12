import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireUserId } from '@/lib/auth-helpers';
import { getTransactionByIdForUser } from '@/lib/db/transactions';
import TransactionForm from '@/components/portfolio/TransactionForm';
import { updateTransactionAction } from '@/app/portfolio/actions';

export const metadata = {
  title: 'Edit transaction',
  robots: { index: false, follow: false },
};

export default async function EditTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await requireUserId();
  const tx = await getTransactionByIdForUser(userId, params.id);
  if (!tx) notFound();

  // Bind the txId into the action so the form posts can include it.
  const action = updateTransactionAction.bind(null, params.id);

  return (
    <div className="portfolio-page portfolio-page-narrow">
      <div className="portfolio-header">
        <div>
          <div className="portfolio-eyebrow">PILL.FINANCE / PORTFOLIO</div>
          <h1 className="portfolio-title">Edit transaction</h1>
        </div>
        <Link href="/portfolio/transactions" className="portfolio-link-secondary">
          ← Cancel
        </Link>
      </div>

      <div className="tx-form-card">
        <TransactionForm
          action={action}
          submitLabel="Save changes"
          defaultValues={{
            assetSlug: tx.assetSlug,
            side: tx.side,
            quantity: String(Number(tx.quantity)),
            priceUsd: String(Number(tx.priceUsd)),
            transactionDate: tx.transactionDate,
            note: tx.note ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
