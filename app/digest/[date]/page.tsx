import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  readBriefing,
  listAvailableDates,
  isValidDate,
} from '@/lib/briefings';
import { CATEGORIES, getAsset } from '@/lib/slugs';
import '../../routes.css';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
  const dates = await listAvailableDates();
  return dates.map(date => ({ date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `Daily Digest — ${date}`,
    description: `Full market digest for ${date}. All 19 assets: past, why, watch.`,
    alternates: { canonical: `https://pill.finance/digest/${date}` },
  };
}

export default async function DigestDatePage({ params }: Props) {
  const { date } = await params;
  if (!isValidDate(date)) notFound();

  const briefing = await readBriefing(date);
  if (!briefing) notFound();

  const dates = await listAvailableDates();
  const idx = dates.indexOf(date);
  const prevDate = idx < dates.length - 1 ? dates[idx + 1] : null;
  const nextDate = idx > 0 ? dates[idx - 1] : null;

  const macro = briefing.macro_context;

  return (
    <>
      <div className="detail-breadcrumb">
        <Link href="/digest/archive">Digest Archive</Link> / {date}
      </div>

      <div className="page-hero">
        <h1>// DAILY DIGEST</h1>
        <p className="headline">
          Market briefing for <span className="accent">{date}</span>
        </p>
        <p className="sub">
          19 assets · {briefing.updates.length} update{briefing.updates.length !== 1 ? 's' : ''} ·
          Market {briefing.market_status}
        </p>
      </div>

      {macro && (macro.dxy != null || macro.us10y != null || macro.vix != null) && (
        <div className="macro-banner">
          {macro.dxy != null && (
            <span className="macro-item">
              <b>DXY</b> {macro.dxy.toFixed(2)}
            </span>
          )}
          {macro.us10y != null && (
            <span className="macro-item">
              <b>US 10Y</b> {macro.us10y.toFixed(3)}%
            </span>
          )}
          {macro.vix != null && (
            <span className="macro-item">
              <b>VIX</b> {macro.vix.toFixed(2)}
            </span>
          )}
          {macro.headline && (
            <span className="macro-headline">{macro.headline}</span>
          )}
        </div>
      )}

      {CATEGORIES.map(cat => {
        const assetsInCat = cat.slugs
          .map(slug => ({ slug, ab: briefing.assets[slug], meta: getAsset(slug) }))
          .filter(a => a.ab && a.meta);

        if (assetsInCat.length === 0) return null;

        return (
          <section key={cat.key} className="category-block">
            <div className="category-header">
              <div className="left">
                <span className="category-name">{cat.label}</span>
                <span className="category-count">{cat.countLabel}</span>
              </div>
            </div>

            {assetsInCat.map(({ slug, ab, meta }) => {
              if (!ab || !meta) return null;
              const latestSection = ab.sections[ab.sections.length - 1];
              const dir = ab.change_pct == null ? '' : ab.change_pct >= 0 ? 'up' : 'down';
              const arrow = ab.change_pct == null ? '' : ab.change_pct >= 0 ? '▲' : '▼';
              const sign = ab.change_pct != null && ab.change_pct >= 0 ? '+' : '';
              const change = ab.change_pct == null
                ? '—'
                : `${arrow} ${sign}${ab.change_pct.toFixed(2)}%`;

              return (
                <div key={slug} className="digest-asset">
                  <div className="digest-asset-header">
                    <Link href={`/asset/${slug}`} className="ticker-link">
                      {meta.ticker} — {meta.displayName}
                    </Link>
                    <span className="price-change">
                      {ab.price_display || '—'}
                      {' '}
                      <span className={dir}>{change}</span>
                    </span>
                  </div>
                  {latestSection && (
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
                  )}
                </div>
              );
            })}
          </section>
        );
      })}

      <div className="date-nav">
        {prevDate ? (
          <Link href={`/digest/${prevDate}`}>← {prevDate}</Link>
        ) : (
          <span className="disabled">← No earlier</span>
        )}
        <Link href="/digest/archive" style={{ color: 'var(--text-faint)', fontSize: '11px' }}>
          ALL DATES
        </Link>
        {nextDate ? (
          <Link href={`/digest/${nextDate}`}>{nextDate} →</Link>
        ) : (
          <span className="disabled">No later →</span>
        )}
      </div>
    </>
  );
}
