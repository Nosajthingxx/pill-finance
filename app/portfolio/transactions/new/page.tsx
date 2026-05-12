import Link from 'next/link';
import TransactionForm from '@/components/portfolio/TransactionForm';
import { createTransactionAction } from '@/app/portfolio/actions';

export const metadata = {
  title: 'Add transaction',
  robots: { index: false, follow: false },
};

export default function NewTransactionPage() {
  return (
    <div className="portfolio-page portfolio-page-narrow">
      <div className="portfolio-header">
        <div>
          <div className="portfolio-eyebrow">PILL.FINANCE / PORTFOLIO</div>
          <h1 className="portfolio-title">Add transaction</h1>
          <p className="portfolio-subtitle">
            Record a buy, sell, short open, or short close.
          </p>
        </div>
        <Link href="/portfolio/transactions" className="portfolio-link-secondary">
          ← Cancel
        </Link>
      </div>

      <div className="tx-form-card">
        <TransactionForm action={createTransactionAction} submitLabel="Save transaction" />
      </div>
    </div>
  );
}
