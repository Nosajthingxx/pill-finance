// Next.js native sitemap generation.
// Returns MetadataRoute.Sitemap — Next.js auto-serves at /sitemap.xml.

import type { MetadataRoute } from 'next';
import { ALL_SLUGS, ASSETS } from '@/lib/slugs';
import { listAvailableDates, getLastModified } from '@/lib/briefings';

const SITE = 'https://pill.finance';

/** Generate all C(19,2) = 171 compare slug pairs, alphabetical order. */
function allComparePairs(): string[] {
  const pairs: string[] = [];
  for (let i = 0; i < ALL_SLUGS.length; i++) {
    for (let j = i + 1; j < ALL_SLUGS.length; j++) {
      const [a, b] = [ALL_SLUGS[i], ALL_SLUGS[j]].sort();
      pairs.push(`${a}-vs-${b}`);
    }
  }
  return pairs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dates = await listAvailableDates();
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0 },
    { path: '/about', priority: 0.3 },
    { path: '/how-it-works', priority: 0.3 },
    { path: '/changelog', priority: 0.3 },
    { path: '/privacy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
    { path: '/contact', priority: 0.3 },
    { path: '/markets', priority: 0.8 },
    { path: '/markets/fx', priority: 0.7 },
    { path: '/markets/commodities', priority: 0.7 },
    { path: '/markets/indices', priority: 0.7 },
    { path: '/markets/crypto', priority: 0.7 },
    { path: '/markets/stocks', priority: 0.7 },
    { path: '/author/selim-onay', priority: 0.4 },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${SITE}${page.path}`,
      lastModified: now,
      changeFrequency: page.priority >= 0.8 ? 'daily' : 'monthly',
      priority: page.priority,
    });
  }

  // Asset hub pages
  for (const slug of ALL_SLUGS) {
    entries.push({
      url: `${SITE}/asset/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Day archive pages: /asset/[slug]/[date]
  for (const date of dates) {
    const lastMod = await getLastModified(date);
    for (const slug of ALL_SLUGS) {
      entries.push({
        url: `${SITE}/asset/${slug}/${date}`,
        lastModified: lastMod?.toISOString() ?? now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Digest pages: /digest/[date]
  for (const date of dates) {
    const lastMod = await getLastModified(date);
    entries.push({
      url: `${SITE}/digest/${date}`,
      lastModified: lastMod?.toISOString() ?? now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // Compare pages: /compare/[slugA]-vs-[slugB]
  for (const pair of allComparePairs()) {
    entries.push({
      url: `${SITE}/compare/${pair}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.5,
    });
  }

  // Learn pages: /learn/[slug]
  for (const slug of ALL_SLUGS) {
    entries.push({
      url: `${SITE}/learn/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  return entries;
}
