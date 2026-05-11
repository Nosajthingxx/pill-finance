// RSS 2.0 feed for pill.finance.
// Serves the latest 20 day archives across all assets.

import { ALL_SLUGS, getAsset } from '@/lib/slugs';
import { listAvailableDates, readBriefing } from '@/lib/briefings';

const SITE = 'https://pill.finance';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const dates = await listAvailableDates();

  // Collect items: for each recent date, one item per asset with briefing data.
  // Cap at 20 total items across all dates.
  const items: string[] = [];

  for (const date of dates) {
    if (items.length >= 20) break;
    const briefing = await readBriefing(date);
    if (!briefing) continue;

    for (const slug of ALL_SLUGS) {
      if (items.length >= 20) break;
      const asset = getAsset(slug);
      const ab = briefing.assets[slug];
      if (!asset || !ab || ab.sections.length === 0) continue;

      const lastSection = ab.sections[ab.sections.length - 1];
      const title = `${asset.displayName} — ${date}`;
      const link = `${SITE}/asset/${slug}/${date}`;
      const pubDate = new Date(lastSection.timestamp_utc).toUTCString();
      const description = escapeXml(lastSection.past.slice(0, 300));

      items.push(`    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>pill.finance</title>
    <link>${SITE}</link>
    <description>AI-powered market intelligence. 19 assets, twice daily.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}
