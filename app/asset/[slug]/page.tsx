import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { AssetBriefing } from '@/lib/types';
import { ALL_SLUGS, getAsset, getCategory } from '@/lib/slugs';
import { readLatestBriefing, listArchivesFor } from '@/lib/briefings';
import BriefingPanel from '@/components/BriefingPanel';
import '../asset.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getAsset(slug);
  if (!meta) return {};

  const briefing = await readLatestBriefing();
  const asset = briefing?.assets[slug];
  const description = asset?.sections?.[0]?.past
    || `Daily briefing for ${meta.commonName}. What happened, why it matters, what to watch.`;

  return {
    title: `${meta.displayName} — pill.finance`,
    description,
    alternates: { canonical: `https://pill.finance/asset/${slug}` },
    openGraph: {
      title: `${meta.displayName} — pill.finance`,
      description,
      url: `https://pill.finance/asset/${slug}`,
    },
  };
}

export default async function AssetHubPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getAsset(slug);
  if (!meta) notFound();

  const briefing = await readLatestBriefing();
  const asset: AssetBriefing | undefined = briefing?.assets[slug];
  const category = getCategory(meta.category);

  const archiveDates = await listArchivesFor(slug, { limit: 30 });

  const dir = asset?.change_pct == null ? '' : asset.change_pct >= 0 ? 'up' : 'down';
  const sign = asset?.change_pct != null && asset.change_pct >= 0 ? '+' : '';
  const changeText = asset?.change_pct == null
    ? '—'
    : `${sign}${asset.change_pct.toFixed(2)}%`;

  // Collect all headlines from all sections
  const allHeadlines = asset?.sections?.flatMap((s) => s.headlines ?? []) ?? [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="detail-header">
        <div className="detail-breadcrumb">
          <Link href="/">HOME</Link>
          {' > '}
          <Link href="/">MARKETS</Link>
          {' > '}
          <Link href="/">{category.label}</Link>
          {' > '}
          <span>{meta.shortName.toUpperCase()}</span>
        </div>

        {/* Hero */}
        <div className="detail-hero">
          <div className="left">
            <span className="ticker-big">{meta.ticker}</span>
            <span className="name-big">{meta.displayName}</span>
          </div>
          <div className="price-block">
            <div className="price-big">{asset?.price_display || '—'}</div>
            <div className={`change-big ${dir}`}>{changeText}</div>
          </div>
        </div>

        {/* Meta row */}
        <div className="detail-meta">
          {asset?.distance_52w_high_pct != null && (
            <span><b>52W HIGH:</b> {asset.distance_52w_high_pct.toFixed(1)}% away</span>
          )}
          {asset?.distance_52w_low_pct != null && (
            <span><b>52W LOW:</b> {asset.distance_52w_low_pct.toFixed(1)}% away</span>
          )}
          {briefing && (
            <span><b>DATE:</b> {briefing.date}</span>
          )}
          {asset?.material_change && (
            <span className="material-change-badge">MATERIAL CHANGE</span>
          )}
        </div>
      </div>

      {/* Key levels */}
      {asset?.key_levels && (asset.key_levels.support?.length || asset.key_levels.resistance?.length) && (
        <div className="levels-block">
          {asset.key_levels.support && asset.key_levels.support.length > 0 && (
            <div className="group">
              <b>SUPPORT:</b>
              {asset.key_levels.support.map((lvl) => (
                <span key={lvl} className="lvl">{lvl}</span>
              ))}
            </div>
          )}
          {asset.key_levels.resistance && asset.key_levels.resistance.length > 0 && (
            <div className="group">
              <b>RESISTANCE:</b>
              {asset.key_levels.resistance.map((lvl) => (
                <span key={lvl} className="lvl">{lvl}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Briefing sections */}
      {asset?.sections?.map((section) => (
        <div key={section.anchor}>
          <div className="section-timestamp">
            <span className="slot-badge">{section.slot.toUpperCase()}</span>
            <span>{section.timestamp_trt}</span>
          </div>
          <BriefingPanel section={section} />
        </div>
      ))}

      {!asset?.sections?.length && (
        <div className="loading">Awaiting first briefing for {meta.displayName}.</div>
      )}

      {/* Headlines */}
      {allHeadlines.length > 0 && (
        <div className="headlines-block">
          <div className="headlines-label">HEADLINES</div>
          <ul className="headlines-list">
            {allHeadlines.map((h, i) => (
              <li key={i}>
                <a href={h.url} target="_blank" rel="noopener noreferrer">
                  {h.title}
                </a>
                {h.source && <span className="src">{h.source}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Archive links */}
      {archiveDates.length > 0 && (
        <div className="archive-links">
          <div className="archive-links-label">RECENT ARCHIVES</div>
          <div className="archive-links-grid">
            {archiveDates.map((date) => (
              <Link key={date} href={`/asset/${slug}/${date}`}>{date}</Link>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <Link
              href={`/asset/${slug}/archive`}
              style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.5px' }}
            >
              VIEW FULL ARCHIVE &rarr;
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
