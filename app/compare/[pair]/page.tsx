import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readLatestBriefing } from '@/lib/briefings';
import { ALL_SLUGS, getAsset, isValidSlug } from '@/lib/slugs';
import '../../routes.css';

interface Props {
  params: Promise<{ pair: string }>;
}

function generateAllPairs(): { slugA: string; slugB: string }[] {
  const sorted = [...ALL_SLUGS].sort();
  const pairs: { slugA: string; slugB: string }[] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      pairs.push({ slugA: sorted[i], slugB: sorted[j] });
    }
  }
  return pairs;
}

export async function generateStaticParams() {
  return generateAllPairs().map(({ slugA, slugB }) => ({
    pair: `${slugA}-vs-${slugB}`,
  }));
}

/** Parse "slugA-vs-slugB" where slugs may contain hyphens. */
function parsePair(pair: string): { slugA: string; slugB: string } | null {
  const vsIndex = pair.indexOf('-vs-');
  if (vsIndex === -1) return null;
  const slugA = pair.slice(0, vsIndex);
  const slugB = pair.slice(vsIndex + 4);
  if (!slugA || !slugB) return null;
  if (!isValidSlug(slugA) || !isValidSlug(slugB)) return null;
  return { slugA, slugB };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: 'Not Found' };
  const a = getAsset(parsed.slugA);
  const b = getAsset(parsed.slugB);
  if (!a || !b) return { title: 'Not Found' };
  return {
    title: `${a.commonName} vs ${b.commonName}`,
    description: `Compare ${a.commonName} and ${b.commonName} side by side with daily briefings.`,
    alternates: { canonical: `https://pill.finance/compare/${pair}` },
  };
}

export default async function ComparePairPage({ params }: Props) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const metaA = getAsset(parsed.slugA);
  const metaB = getAsset(parsed.slugB);
  if (!metaA || !metaB) notFound();

  const briefing = await readLatestBriefing();
  const abA = briefing?.assets[parsed.slugA];
  const abB = briefing?.assets[parsed.slugB];

  function renderChange(changePct: number | null | undefined) {
    if (changePct == null) return '--';
    const dir = changePct >= 0 ? 'up' : 'down';
    const arrow = changePct >= 0 ? '▲' : '▼';
    const sign = changePct >= 0 ? '+' : '';
    return <span className={dir}>{arrow} {sign}{changePct.toFixed(2)}%</span>;
  }

  function renderPanel(
    meta: NonNullable<ReturnType<typeof getAsset>>,
    ab: typeof abA,
  ) {
    const latestSection = ab?.sections?.[ab.sections.length - 1];
    return (
      <div className="compare-panel">
        <Link href={`/asset/${meta.slug}`}>
          <div className="panel-ticker">{meta.ticker}</div>
        </Link>
        <div className="panel-name">{meta.displayName}</div>
        <div className="panel-price">{ab?.price_display || '--'}</div>
        <div className={`panel-change`}>{renderChange(ab?.change_pct)}</div>
        {latestSection && (
          <>
            <div className="digest-cols">
              <div className="digest-col">
                <div className="digest-col-label past">PAST</div>
                {latestSection.past}
              </div>
              <div className="digest-col">
                <div className="digest-col-label why">WHY</div>
                {latestSection.why}
              </div>
              <div className="digest-col">
                <div className="digest-col-label watch">WATCH</div>
                {latestSection.watch}
              </div>
            </div>
          </>
        )}
        {!latestSection && (
          <p style={{ color: 'var(--text-faint)', fontSize: '12px', marginTop: '12px' }}>
            Awaiting first briefing data.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="detail-breadcrumb">
        <Link href="/compare">Compare</Link> / {metaA.shortName} vs {metaB.shortName}
      </div>

      <div className="page-hero">
        <h1>// COMPARE</h1>
        <p className="headline">
          <span className="accent">{metaA.commonName}</span> vs{' '}
          <span className="accent">{metaB.commonName}</span>
        </p>
        <p className="sub">
          {briefing
            ? `Latest data from ${briefing.date}`
            : 'Awaiting first refresh'}
        </p>
      </div>

      <div className="compare-side">
        {renderPanel(metaA, abA)}
        {renderPanel(metaB, abB)}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/compare" className="back-link">← All comparisons</Link>
      </div>
    </>
  );
}
