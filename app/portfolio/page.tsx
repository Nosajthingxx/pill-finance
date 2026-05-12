// /portfolio -- temporary basic dashboard.
// Phase 5 replaces this with the real version (P/L totals, allocation, winners/losers).

import Link from 'next/link';
import { requireUserId } from '@/lib/auth-helpers';
import { getRecentTransactionsForUser } from '@/lib/db/transactions';
import { getAllTransactionsForUser } from '@/lib/db/transactions';
import { computePortfolio } from '@/lib/portfolio';
import { readLatestBriefing } from '@/lib/briefings';

export const metadata = {
  title: 'Portfolio',
  robots: { index: false, follow: false },
};

export default async function PortfolioPage() {
  const userId = await requireUserId();
  const [allTx, recent, briefing] = await Promise.all([
    getAllTransactionsForUser(userId),
    getRecentTransactionsForUser(userId, 5),
    readLatestBriefing(),
  ]);

  // Build price map from latest briefing
  const prices: Record<string, number> = {};
  if (briefing?.assets) {
    for (const [slug, asset] of Object.entries(briefing.assets)) {
      if (typeof asset.price === 'number') prices[slug] = asset.price;
    }
  }

  const { positions, totals } = computePortfolio(allTx, prices);
  const hasData = allTx.length > 0;

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div>
          <div className="portfolio-eyebrow">PILL.FINANCE / PORTFOLIO</div>
          <h1 className="portfolio-title">Your portfolio</h1>
          <p className="portfolio-subtitle">
            Prices refresh twice daily with each market briefing.
          </p>
        </div>
        <div className="portfolio-actions">
          <Link href="/portfolio/asset-requests" className="portfolio-link-secondary">
            Request asset
          </Link>
          <Link href="/portfolio/transactions" className="portfolio-link-secondary">
            All transactions
          </Link>
          <Link href="/portfolio/transactions/new" className="portfolio-cta">
            + Add transaction
          </Link>
        </div>
      </div>

      {!hasData ? (
        <div className="tx-empty">
          <p>You haven't added any transactions yet.</p>
          <Link href="/portfolio/transactions/new" className="tx-empty-cta">
            Add your first transaction →
          </Link>
        </div>
      ) : (
        <>
          <div className="totals-grid">
            <TotalCard label="Total value" value={totals.totalMarketValue} mono />
            <TotalCard label="Total P/L" value={totals.totalPl} pl />
            <TotalCard label="Unrealized P/L" value={totals.totalUnrealizedPl} pl />
            <TotalCard label="Realized P/L" value={totals.totalRealizedPl} pl />
          </div>

          <h2 className="portfolio-h2">Open positions</h2>
          {positions.filter((p) => p.netQty !== 0).length === 0 ? (
            <p className="portfolio-muted">No open positions. (All have been closed out.)</p>
          ) : (
            <div className="tx-table-wrap">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th className="tx-num">Position</th>
                    <th className="tx-num">Qty</th>
                    <th className="tx-num">Avg cost</th>
                    <th className="tx-num">Current</th>
                    <th className="tx-num">Market value</th>
                    <th className="tx-num">Unrealized P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.filter((p) => p.netQty !== 0).map((p) => {
                    const isLong = p.netQty > 0;
                    const plPositive = p.unrealizedPlUsd >= 0;
                    return (
                      <tr key={p.assetSlug}>
                        <td><span className="tx-asset">{p.assetSlug}</span></td>
                        <td className="tx-num">
                          <span className={isLong ? 'tx-side tx-side-long' : 'tx-side tx-side-short'}>
                            {isLong ? 'LONG' : 'SHORT'}
                          </span>
                        </td>
                        <td className="tx-num tx-mono">{Math.abs(p.netQty).toLocaleString('en-US', { maximumFractionDigits: 8 })}</td>
                        <td className="tx-num tx-mono">${p.avgCostUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                        <td className="tx-num tx-mono">${p.currentPriceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                        <td className="tx-num tx-mono">${p.marketValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className={`tx-num tx-mono ${plPositive ? 'up' : 'down'}`}>
                          {plPositive ? '+' : ''}${p.unrealizedPlUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {p.unrealizedPlPct !== null && (
                            <span className="tx-pct"> ({plPositive ? '+' : ''}{(p.unrealizedPlPct * 100).toFixed(2)}%)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <h2 className="portfolio-h2">Recent transactions</h2>
          <div className="portfolio-recent">
            {recent.map((tx) => (
              <div key={tx.id} className="portfolio-recent-row">
                <span className="tx-date">{tx.transactionDate}</span>
                <span className="tx-asset">{tx.assetSlug}</span>
                <span className={`tx-side ${tx.side === 'buy' || tx.side === 'short_close' ? 'tx-side-long' : 'tx-side-short'}`}>
                  {tx.side.replace('_', ' ')}
                </span>
                <span className="tx-mono">{Number(tx.quantity)} @ ${Number(tx.priceUsd)}</span>
              </div>
            ))}
            <Link href="/portfolio/transactions" className="portfolio-link-secondary" style={{ marginTop: 12, alignSelf: 'flex-start' }}>
              View all →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function TotalCard({ label, value, pl }: { label: string; value: number; pl?: boolean; mono?: boolean }) {
  const positive = value >= 0;
  const cls = pl ? (positive ? 'up' : 'down') : '';
  const sign = pl ? (positive ? '+' : '-') : '';
  return (
    <div className="total-card">
      <div className="total-label">{label}</div>
      <div className={`total-value tx-mono ${cls}`}>
        {sign}${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}
