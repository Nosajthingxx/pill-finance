import type { Metadata } from 'next';
import { readLatestBriefing } from '@/lib/briefings';
import { CATEGORIES } from '@/lib/slugs';
import CategoryBlock from '@/components/CategoryBlock';

export const metadata: Metadata = {
  title: 'pill.finance — 19 assets, twice daily, 10 minute read',
  description:
    'Past, why, watch. The fastest way to know what moved across FX, commodities, indices, crypto, and mega-cap stocks. Refreshed every weekday morning and evening.',
  alternates: {
    canonical: 'https://pill.finance/',
  },
};

export default async function HomePage() {
  const briefing = await readLatestBriefing();

  const lastUpdate = briefing?.updates?.[briefing.updates.length - 1];
  const lastUpdateLabel = lastUpdate
    ? `Refreshed ${lastUpdate.timestamp_trt}`
    : 'Awaiting first refresh';

  // Calculate next refresh in TRT (06:30 or 19:00 next weekday).
  // Phase-1 simple heuristic: if last was 'am', next is 19:00 same day; if 'pm', next is 06:30 next weekday.
  const nextRefreshLabel = (() => {
    if (!lastUpdate) return '—';
    if (lastUpdate.slot === 'am') return 'Next refresh ~19:00 TRT';
    return 'Next refresh ~06:30 TRT';
  })();

  return (
    <>
      <div className="sub-hero">
        <h1>// 19 ASSETS · TWICE DAILY · MON–FRI · 10 MIN READ</h1>
        <p>
          Skim-and-go market intelligence.
          <br />
          What happened, why it matters, <span className="accent">what to watch.</span>
        </p>
        <div className="meta">
          <span>
            <span className="dot" />
            {lastUpdateLabel}
          </span>
          <span>
            <span className="dot" />
            {nextRefreshLabel}
          </span>
          <span>
            <span className="dot" />
            All times TRT · prices indicative
          </span>
        </div>
      </div>

      {!briefing ? (
        <div className="loading">No briefings yet. The first AM run will populate this page.</div>
      ) : (
        CATEGORIES.map(cat => (
          <CategoryBlock key={cat.key} category={cat} briefing={briefing} />
        ))
      )}
    </>
  );
}
