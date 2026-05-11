import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readLatestBriefing } from '@/lib/briefings';
import { CATEGORIES, getAsset, getCategory } from '@/lib/slugs';
import type { AssetCategory } from '@/lib/types';
import '../../routes.css';

const CATEGORY_TITLES: Record<AssetCategory, string> = {
  fx: 'FX Markets',
  commodities: 'Commodities Markets',
  indices: 'Index Markets',
  crypto: 'Crypto Markets',
  stocks: 'Stock Markets',
};

const CATEGORY_DESCRIPTIONS: Record<AssetCategory, string> = {
  fx: 'Daily briefings for major forex pairs: EUR/USD, GBP/USD, USD/JPY, and AUD/USD.',
  commodities: 'Daily briefings for gold, silver, and crude oil.',
  indices: 'Daily briefings for S&P 500, Nasdaq 100, and Dow Jones.',
  crypto: 'Daily briefings for Bitcoin and Ethereum.',
  stocks: 'Daily briefings for NVDA, TSLA, AAPL, MSFT, META, GOOGL, and AMZN.',
};

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const key = category as AssetCategory;
  const title = CATEGORY_TITLES[key];
  if (!title) return { title: 'Not Found' };
  return {
    title,
    description: CATEGORY_DESCRIPTIONS[key],
    alternates: { canonical: `https://pill.finance/markets/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const validKeys: string[] = CATEGORIES.map(c => c.key);
  if (!validKeys.includes(category)) notFound();

  const cat = getCategory(category as AssetCategory);
  const briefing = await readLatestBriefing();

  return (
    <>
      <div className="detail-breadcrumb">
        <Link href="/markets">Markets</Link> / {cat.label}
      </div>

      <div className="page-hero">
        <h1>// {cat.label}</h1>
        <p className="headline">
          {CATEGORY_TITLES[cat.key]} — <span className="accent">{cat.countLabel.toLowerCase()}</span>
        </p>
        <p className="sub">
          {briefing
            ? `Latest data from ${briefing.date}`
            : 'Awaiting first refresh'}
        </p>
      </div>

      <nav className="category-nav">
        {CATEGORIES.map(c => (
          <Link
            key={c.key}
            href={`/markets/${c.key}`}
            className={c.key === cat.key ? 'active' : ''}
          >
            {c.label}
          </Link>
        ))}
      </nav>

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
    </>
  );
}
