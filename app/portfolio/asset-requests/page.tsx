import Link from 'next/link';
import { requireUserId } from '@/lib/auth-helpers';
import {
  getAssetRequestsForUser,
  getAssetRequestLeaderboard,
} from '@/lib/db/asset-requests';
import { ASSETS } from '@/lib/slugs';
import AssetRequestForm from '@/components/portfolio/AssetRequestForm';
import VoteButton from '@/components/portfolio/VoteButton';
import { removeAssetRequestAction } from '@/app/portfolio/actions';

export const metadata = {
  title: 'Request an asset',
  robots: { index: false, follow: false },
};

const SUPPORTED_TICKERS = new Set(ASSETS.map((a) => a.ticker.toUpperCase()));

export default async function AssetRequestsPage() {
  const userId = await requireUserId();
  const [mine, leaderboard] = await Promise.all([
    getAssetRequestsForUser(userId),
    getAssetRequestLeaderboard(20),
  ]);
  const myTickers = new Set(mine.map((r) => r.ticker));

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div>
          <div className="portfolio-eyebrow">PILL.FINANCE / PORTFOLIO</div>
          <h1 className="portfolio-title">Request an asset</h1>
          <p className="portfolio-subtitle">
            Tell us what to brief next. Vote on what the community wants.
          </p>
        </div>
        <Link href="/portfolio" className="portfolio-link-secondary">
          ← Dashboard
        </Link>
      </div>

      <div className="ar-grid">
        <section className="ar-card">
          <h2 className="ar-h2">Submit a ticker</h2>
          <p className="portfolio-muted ar-section-sub">
            Any stock, FX pair, commodity, or crypto. We'll consider the top voted ones first.
          </p>
          <AssetRequestForm />

          <h3 className="ar-h3">Your requests</h3>
          {mine.length === 0 ? (
            <p className="portfolio-muted ar-empty">You haven't requested anything yet.</p>
          ) : (
            <ul className="ar-mine-list">
              {mine.map((r) => (
                <li key={r.ticker} className="ar-mine-row">
                  <span className="ar-ticker">{r.ticker}</span>
                  <form action={removeAssetRequestAction.bind(null, r.ticker)}>
                    <button type="submit" className="tx-row-delete" aria-label={`Remove ${r.ticker}`}>
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ar-card">
          <h2 className="ar-h2">Community leaderboard</h2>
          <p className="portfolio-muted ar-section-sub">
            Top voted tickers across all users. Already-supported tickers are hidden.
          </p>
          {leaderboard.length === 0 ? (
            <p className="portfolio-muted ar-empty">No requests yet -- be first.</p>
          ) : (
            <ol className="ar-leaderboard">
              {leaderboard
                .filter((row) => !SUPPORTED_TICKERS.has(row.ticker))
                .map((row, idx) => {
                  const voted = myTickers.has(row.ticker);
                  return (
                    <li key={row.ticker} className="ar-leader-row">
                      <span className="ar-rank">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="ar-ticker">{row.ticker}</span>
                      <span className="ar-count">{row.count} {row.count === 1 ? 'vote' : 'votes'}</span>
                      <VoteButton ticker={row.ticker} voted={voted} />
                    </li>
                  );
                })}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
