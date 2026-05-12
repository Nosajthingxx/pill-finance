import Link from 'next/link';
import { requireUserId } from '@/lib/auth-helpers';
import { getRecentTransactionsForUser } from '@/lib/db/transactions';
import TransactionTable from '@/components/portfolio/TransactionTable';

export const metadata = {
  title: 'Transactions',
  robots: { index: false, follow: false },
};

export default async function TransactionsPage() {
  const userId = await requireUserId();
  const transactions = await getRecentTransactionsForUser(userId, 200);

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div>
          <div className="portfolio-eyebrow">PILL.FINANCE / PORTFOLIO</div>
          <h1 className="portfolio-title">Transactions</h1>
          <p className="portfolio-subtitle">
            All your buys, sells, and shorts. Edit or delete any row.
          </p>
        </div>
        <div className="portfolio-actions">
          <Link href="/portfolio" className="portfolio-link-secondary">← Dashboard</Link>
          <Link href="/portfolio/transactions/new" className="portfolio-cta">
            + Add transaction
          </Link>
        </div>
      </div>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
