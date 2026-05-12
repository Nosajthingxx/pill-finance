// JSON-LD structured data generators for pill.finance.
// Used by page components to inject schema.org markup via <script type="application/ld+json">.

import type { AssetMeta } from './slugs';
import type { AssetBriefing } from './types';

const SITE_URL = 'https://pill.finance';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'pill.finance',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'AI-powered market intelligence lab delivering twice-daily briefings across FX, commodities, indices, crypto, and stocks.',
    founder: {
      '@type': 'Person',
      name: 'Selim Onay',
      url: `${SITE_URL}/author/selim-onay`,
    },
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'pill.finance',
    url: SITE_URL,
    description:
      'What happened, why it matters, what to watch. 19 assets, twice daily.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/asset/{slug}`,
      },
      'query-input': 'required name=slug',
    },
  };
}

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Selim Onay',
    url: `${SITE_URL}/author/selim-onay`,
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'pill.finance',
      url: SITE_URL,
    },
    description:
      'Forex broker operations expert and co-founder of FXHelpDesk. Founder of pill.finance.',
    knowsAbout: [
      'Foreign Exchange',
      'Broker Operations',
      'Market Analysis',
      'Financial Technology',
    ],
  };
}

export function newsArticleSchema(
  asset: AssetMeta,
  date: string,
  briefing: AssetBriefing,
) {
  const lastSection = briefing.sections[briefing.sections.length - 1];
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: `${asset.displayName} Briefing -- ${date}`,
    datePublished: briefing.sections[0]?.timestamp_utc ?? `${date}T03:30:00Z`,
    dateModified: lastSection?.timestamp_utc ?? `${date}T03:30:00Z`,
    author: {
      '@type': 'Organization',
      name: 'pill.finance',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'pill.finance',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    description: lastSection?.past?.slice(0, 200) ?? '',
    mainEntityOfPage: `${SITE_URL}/asset/${asset.slug}/${date}`,
    about: {
      '@type': 'FinancialProduct',
      name: asset.displayName,
      tickerSymbol: asset.ticker,
    },
  };
}

export function financialProductSchema(asset: AssetMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: asset.displayName,
    description: `AI-powered daily briefings for ${asset.commonName} (${asset.ticker}). ${asset.disambiguation}`,
    url: `${SITE_URL}/asset/${asset.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'pill.finance',
      url: SITE_URL,
    },
    category: asset.category,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function articleSchema(
  title: string,
  date: string,
  description: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Organization',
      name: 'pill.finance',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'pill.finance',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    description,
    mainEntityOfPage: SITE_URL,
  };
}
