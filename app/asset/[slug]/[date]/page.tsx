import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { AssetBriefing } from '@/lib/types';
import { ALL_SLUGS, getAsset, getCategory } from '@/lib/slugs';
import { readBriefing, listAvailableDates, isValidDate } from '@/lib/briefings';
import BriefingPanel from '@/components/BriefingPanel';
import '../../asset.css';

interface PageProps {
  params: Promise<{ slug: string; date: string }>;
}

export async function generateStaticParams() {
  const dates = await listAvailableDates();
  const params: { slug: string; date: string }[] = [];
  for (const slug of ALL_SLUGS) {
    for (const date of dates) {
      params.push({ slug, date });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, date } = await params;
  const meta = getAsset(slug);
  if (!meta) return {};

  return {
    title: `${meta.shortName} — ${date}`,
    description: `${meta.commonName} briefing for ${date}. What happened, why it matters, what to watch.`,
    alternates: { canonical: `https://pill.finance/asset/${slug}/${date}` },
    openGraph: {
      title: `${meta.shortName} — ${date} · pill.finance`,
      description: `${meta.commonName} briefing for ${date}.`,
      url: `https://pill.finance/asset/${slug}/${date}`,
    },
  };
}

export default async function AssetDatePage({ params }: PageProps) {
  const { slug, date } = await params;
  const meta = getAsset(slug);
  if (!meta) notFound();
  if (!isValidDate(date)) notFound();

  const briefing = await readBriefing(date);
  if (!briefing) notFound();

  const asset: AssetBriefing | undefined = briefing.assets[slug];
  if (!asset) notFound();

  const category = getCategory(meta.category);

  const dir = asset.change_pct == null ? '' : asset.change_pct >= 0 ? 'up' : 'down';
  const sign = asset.change_pct != null && asset.change_pct >= 0 ? '+' : '';
  const changeText = asset.change_pct == null
    ? '—'
    : `${sign}${asset.change_pct.toFixed(2)}%`;

  // Determine prev/next dates
  const allDates = await listAvailableDates(); // descending
  const idx = allDates.indexOf(date);
  const newerDate = idx > 0 ? allDates[idx - 1] : null;
  const olderDate = idx >= 0 && idx < allDates.length - 1 ? allDates[idx + 1] : null;

  // Collect all headlines
  const allHeadlines = asset.sections.flatMap((s) => s.headlines ?? []);

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
          <Link href={`/asset/${slug}`}>{meta.shortName.toUpperCase()}</Link>
          {' > '}
          <span>{date}</span>
        </div>

        {/* Hero */}
        <div className="detail-hero">
          <div className="left">
            <span className="ticker-big">{meta.ticker}</span>
            <span className="name-big">{meta.displayName}</span>
          </div>
          <div className="price-block">
            <div className="price-big">{asset.price_display || '—'}</div>
            <div className={`change-big ${dir}`}>{changeText}</div>
          </div>
        </div>

        <div className="detail-meta">
          <span><b>DATE:</b> {date}</span>
          {asset.material_change && (
            <span className="material-change-badge">MATERIAL CHANGE</span>
          )}
        </div>
      </div>

      {/* Key levels */}
      {asset.key_levels && (asset.key_levels.support?.length || asset.key_levels.resistance?.length) && (
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

      {/* Briefing sections chronologically */}
      {asset.sections.map((section) => (
        <div key={section.anchor}>
          <div className="section-timestamp">
            <span className="slot-badge">{section.slot.toUpperCase()}</span>
            <span>{section.timestamp_trt}</span>
          </div>
          <BriefingPanel section={section} />
        </div>
      ))}

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

      {/* Prev/Next navigation */}
      <div className="date-nav">
        {olderDate ? (
          <Link href={`/asset/${slug}/${olderDate}`}>&larr; {olderDate}</Link>
        ) : (
          <span className="placeholder">&larr; older</span>
        )}
        <Link href={`/asset/${slug}/archive`} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-faint)' }}>
          ARCHIVE
        </Link>
        {newerDate ? (
          <Link href={`/asset/${slug}/${newerDate}`}>{newerDate} &rarr;</Link>
        ) : (
          <span className="placeholder">newer &rarr;</span>
        )}
      </div>
    </>
  );
}
