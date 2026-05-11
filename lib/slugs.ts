// Single source of truth for the 19 V1 assets.
// Slugs are LOCKED per docs/11-url-architecture.md and must never change.
// New assets get appended; existing entries are immutable.

import type { AssetCategory } from './types';

export interface AssetMeta {
  /** URL slug — locked, never changes. Used as the path segment under /asset/ */
  slug: string;
  /** Broker / market ticker symbol (display-only, used in H1 and content) */
  ticker: string;
  /** Human-readable display name */
  displayName: string;
  /** Short name for narrow UI surfaces */
  shortName: string;
  /** SEO-friendly common name (used in titles, meta descriptions) */
  commonName: string;
  category: AssetCategory;
  /**
   * Disambiguation note — what THIS slug specifically covers.
   * Future variants (futures, ETFs, alternative pairs) get NEW slugs;
   * never overload these.
   */
  disambiguation: string;
}

export const ASSETS: AssetMeta[] = [
  // FX — broker tickers win on search volume in this category
  { slug: 'eur-usd', ticker: 'EURUSD', displayName: 'Euro / US Dollar',     shortName: 'EUR/USD', commonName: 'EUR/USD',     category: 'fx',          disambiguation: 'Spot EUR/USD' },
  { slug: 'gbp-usd', ticker: 'GBPUSD', displayName: 'British Pound / US Dollar', shortName: 'GBP/USD', commonName: 'GBP/USD', category: 'fx',          disambiguation: 'Spot GBP/USD' },
  { slug: 'usd-jpy', ticker: 'USDJPY', displayName: 'US Dollar / Japanese Yen',  shortName: 'USD/JPY', commonName: 'USD/JPY', category: 'fx',          disambiguation: 'Spot USD/JPY' },
  { slug: 'aud-usd', ticker: 'AUDUSD', displayName: 'Australian Dollar / US Dollar', shortName: 'AUD/USD', commonName: 'AUD/USD', category: 'fx',      disambiguation: 'Spot AUD/USD' },

  // Commodities — consumer names dominate search
  { slug: 'gold',       ticker: 'XAUUSD', displayName: 'Gold (XAU/USD)',        shortName: 'Gold',   commonName: 'Gold',       category: 'commodities', disambiguation: 'Spot gold (XAU/USD CFD). Not gold futures, not GLD ETF.' },
  { slug: 'silver',     ticker: 'XAGUSD', displayName: 'Silver (XAG/USD)',      shortName: 'Silver', commonName: 'Silver',     category: 'commodities', disambiguation: 'Spot silver (XAG/USD CFD). Not silver futures.' },
  { slug: 'crude-oil',  ticker: 'USOIL',  displayName: 'Crude Oil (WTI)',       shortName: 'Crude',  commonName: 'Crude Oil',  category: 'commodities', disambiguation: 'WTI spot CFD (USOIL). Not Brent, not futures.' },

  // Indices — consumer benchmark names dominate search
  { slug: 'sp-500',     ticker: 'US500',  displayName: 'S&P 500',               shortName: 'S&P 500', commonName: 'S&P 500',   category: 'indices',     disambiguation: 'Cash S&P 500 CFD (US500). Not /ES futures.' },
  { slug: 'nasdaq-100', ticker: 'NAS100', displayName: 'Nasdaq 100',            shortName: 'Nasdaq',  commonName: 'Nasdaq 100', category: 'indices',     disambiguation: 'Cash Nasdaq 100 CFD (NAS100). Not /NQ futures.' },
  { slug: 'dow-jones',  ticker: 'US30',   displayName: 'Dow Jones (DJIA)',      shortName: 'Dow',     commonName: 'Dow Jones', category: 'indices',     disambiguation: 'Cash Dow Jones Industrial Average CFD (US30).' },

  // Crypto — consumer names dominate search
  { slug: 'bitcoin',    ticker: 'BTCUSD', displayName: 'Bitcoin',               shortName: 'BTC',    commonName: 'Bitcoin',   category: 'crypto',      disambiguation: 'BTC/USD spot. Not bitcoin futures, not GBTC.' },
  { slug: 'ethereum',   ticker: 'ETHUSD', displayName: 'Ethereum',              shortName: 'ETH',    commonName: 'Ethereum',  category: 'crypto',      disambiguation: 'ETH/USD spot. Not ETH futures.' },

  // Stocks — ticker IS the consumer search term, so ticker = slug
  { slug: 'nvda',  ticker: 'NVDA',  displayName: 'NVIDIA Corporation',     shortName: 'NVDA',  commonName: 'NVIDIA',  category: 'stocks', disambiguation: 'NVDA common shares.' },
  { slug: 'tsla',  ticker: 'TSLA',  displayName: 'Tesla, Inc.',            shortName: 'TSLA',  commonName: 'Tesla',   category: 'stocks', disambiguation: 'TSLA common shares.' },
  { slug: 'aapl',  ticker: 'AAPL',  displayName: 'Apple Inc.',             shortName: 'AAPL',  commonName: 'Apple',   category: 'stocks', disambiguation: 'AAPL common shares.' },
  { slug: 'msft',  ticker: 'MSFT',  displayName: 'Microsoft Corporation',  shortName: 'MSFT',  commonName: 'Microsoft', category: 'stocks', disambiguation: 'MSFT common shares.' },
  { slug: 'meta',  ticker: 'META',  displayName: 'Meta Platforms, Inc.',   shortName: 'META',  commonName: 'Meta',    category: 'stocks', disambiguation: 'META Class A common shares.' },
  { slug: 'googl', ticker: 'GOOGL', displayName: 'Alphabet Inc. (Class A)',shortName: 'GOOGL', commonName: 'Alphabet',category: 'stocks', disambiguation: 'GOOGL Class A. Not GOOG (Class C).' },
  { slug: 'amzn',  ticker: 'AMZN',  displayName: 'Amazon.com, Inc.',       shortName: 'AMZN',  commonName: 'Amazon',  category: 'stocks', disambiguation: 'AMZN common shares.' },
];

/** Lookup by slug — O(1) via the indexed map. */
const BY_SLUG: Record<string, AssetMeta> = Object.fromEntries(ASSETS.map(a => [a.slug, a]));

export function getAsset(slug: string): AssetMeta | undefined {
  return BY_SLUG[slug];
}

export function isValidSlug(slug: string): boolean {
  return slug in BY_SLUG;
}

/** All slugs in display order — drives generateStaticParams */
export const ALL_SLUGS: string[] = ASSETS.map(a => a.slug);

export interface CategoryMeta {
  key: AssetCategory;
  label: string;
  countLabel: string;
  slugs: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'fx',          label: 'FX',          countLabel: '04 PAIRS',     slugs: ASSETS.filter(a => a.category === 'fx').map(a => a.slug) },
  { key: 'commodities', label: 'COMMODITIES', countLabel: '03 ASSETS',    slugs: ASSETS.filter(a => a.category === 'commodities').map(a => a.slug) },
  { key: 'indices',     label: 'INDICES',     countLabel: '03 BENCHMARKS', slugs: ASSETS.filter(a => a.category === 'indices').map(a => a.slug) },
  { key: 'crypto',      label: 'CRYPTO',      countLabel: '02 ASSETS',    slugs: ASSETS.filter(a => a.category === 'crypto').map(a => a.slug) },
  { key: 'stocks',      label: 'STOCKS',      countLabel: '07 MEGA-CAPS', slugs: ASSETS.filter(a => a.category === 'stocks').map(a => a.slug) },
];

export function getCategory(key: AssetCategory): CategoryMeta {
  const cat = CATEGORIES.find(c => c.key === key);
  if (!cat) throw new Error(`Unknown category: ${key}`);
  return cat;
}
