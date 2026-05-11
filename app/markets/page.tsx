import type { Metadata } from 'next';
import Link from 'next/link';
import { readLatestBriefing } from '@/lib/briefings';
import { CATEGORIES, getAsset } from '@/lib/slugs';
import type { AssetCategory } from '@/lib/types';
import '../routes.css';

export const metadata: Metadata = {
  title: 'Markets',
  description:
    'Browse all 19 assets across FX, commodities, indices, crypto, and stocks with live briefings.',
  alternates: { canonical: 'https://pill.finance/markets' },
};

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  fx: 'FX Markets',
  commodities: 'Commodities',
  indices: 'Indices',
  crypto: 'Crypto',
  stocks: 'Stocks',
};

export default async function MarketsPage() {
  const briefing = await readLatestBriefing();

  return (
    <>
      <div className="page-hero">
        <h1>// MARKETS</h1>
        <p className="headline">
          All <span className="accent">19 assets</span> across five categories
        </p>
        <p className="sub">
          {briefing
            ? `Latest data from ${briefing.date}`
            : 'Awaiting first refresh'}
        </p>
      </div>

      <nav className="category-nav">
        {CATEGORIES.map(cat => (
          <Link key={cat.key} href={`/markets/${cat.key}`}>
            {cat.label}
          </Link>
        ))}
      </nav>

      {CATEGORIES.map(cat => (
        <section key={cat.key} className="category-block">
          <div className="category-header">
            <div className="left">
              <Link href={`/markets/${cat.key}`} className="category-name" style={{ textDecoration: 'none' }}>
                {cat.label}
              </Link>
              <span className="category-count">{cat.countLabel}</span>
            </div>
            <Link
              href={`/markets/${cat.key}`}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '10px',
                color: 'var(--text-faint)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              View all →
            </Link>
          </div>
          <div className="asset-grid">
            {cat.slugs.map(slug => {
              const meta = getAsset(slug);
              if (!meta) return null;
              const ab = briefing?.assets[slug];
              const dir = ab?.change_pct == null ? '' : ab.change_pct >= 0 ? 'up' : 'down';
              const arrow = ab?.change_pct == null ? '' : ab.change_pct >= 0 ? '▲' : '▼';
              const sign = ab?.change_pct != null && ab.change_pct >= 0 ? '+' : '';
              const change = ab?.change_pct == null
                ? '—'
                : `${arrow} ${sign}${ab.change_pct.toFixed(2)}%`;
              const teaser = ab?.sections?.[0]?.past || 'Awaiting first refresh.';

              return (
                <Link
                  key={slug}
                  href={`/asset/${slug}`}
                  className="asset-card"
                  aria-label={`${meta.displayName} briefing`}
                >
                  <div className="row1">
                    <span className="ticker">{meta.ticker}</span>
                    <span className="read-arrow" aria-hidden="true">→</span>
                  </div>
                  <span className="name">{meta.displayName}</span>
                  <span className="price">{ab?.price_display || '—'}</span>
                  <span className={`change ${dir}`}>{change}</span>
                  <div className="briefing-teaser">{teaser}</div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
