import Link from 'next/link';
import { getAsset } from '@/lib/slugs';
import type { Transaction } from '@/db/schema';
import DeleteTransactionButton from './DeleteTransactionButton';

const SIDE_LABEL: Record<string, string> = {
  buy: 'Buy',
  sell: 'Sell',
  short_open: 'Short open',
  short_close: 'Short close',
};

const SIDE_COLOR: Record<string, string> = {
  buy: 'tx-side-long',
  sell: 'tx-side-long-out',
  short_open: 'tx-side-short',
  short_close: 'tx-side-short-out',
};

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="tx-empty">
        <p>No transactions yet.</p>
        <Link href="/portfolio/transactions/new" className="tx-empty-cta">
          Add your first transaction →
        </Link>
      </div>
    );
  }

  return (
    <div className="tx-table-wrap">
      <table className="tx-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset</th>
            <th>Action</th>
            <th className="tx-num">Quantity</th>
            <th className="tx-num">Price USD</th>
            <th className="tx-num">Total USD</th>
            <th>Note</th>
            <th className="tx-actions-col"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const asset = getAsset(tx.assetSlug);
            const qty = Number(tx.quantity);
            const price = Number(tx.priceUsd);
            const total = qty * price;
            return (
              <tr key={tx.id}>
                <td className="tx-date">{tx.transactionDate}</td>
                <td>
                  <span className="tx-asset">{asset?.shortName ?? tx.assetSlug}</span>
                </td>
                <td>
                  <span className={`tx-side ${SIDE_COLOR[tx.side] ?? ''}`}>
                    {SIDE_LABEL[tx.side] ?? tx.side}
                  </span>
                </td>
                <td className="tx-num tx-mono">{qty.toLocaleString('en-US', { maximumFractionDigits: 8 })}</td>
                <td className="tx-num tx-mono">${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</td>
                <td className="tx-num tx-mono">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="tx-note">{tx.note ?? ''}</td>
                <td className="tx-actions-col">
                  <Link href={`/portfolio/transactions/${tx.id}/edit`} className="tx-row-edit">
                    Edit
                  </Link>
                  <DeleteTransactionButton txId={tx.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
