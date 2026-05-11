import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_SLUGS, getAsset } from '@/lib/slugs';
import { listArchivesFor } from '@/lib/briefings';
import '../../asset.css';

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

  return {
    title: `${meta.shortName} Archive`,
    description: `Full archive of daily briefings for ${meta.commonName}.`,
    alternates: { canonical: `https://pill.finance/asset/${slug}/archive` },
  };
}

/** Group dates by YYYY-MM and return in descending order. */
function groupByMonth(dates: string[]): { month: string; dates: string[] }[] {
  const map = new Map<string, string[]>();
  for (const d of dates) {
    const ym = d.slice(0, 7);
    if (!map.has(ym)) map.set(ym, []);
    map.get(ym)!.push(d);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([month, dates]) => ({ month, dates }));
}

/** Format YYYY-MM to a human label like "MAY 2026". */
function formatMonth(ym: string): string {
  const [year, month] = ym.split('-');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export default async function ArchiveIndexPage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getAsset(slug);
  if (!meta) notFound();

  const dates = await listArchivesFor(slug);
  const groups = groupByMonth(dates);

  return (
    <>
      <div className="detail-header">
        <div className="detail-breadcrumb">
          <Link href="/">HOME</Link>
          {' > '}
          <Link href={`/asset/${slug}`}>{meta.shortName.toUpperCase()}</Link>
          {' > '}
          <span>ARCHIVE</span>
        </div>

        <div className="detail-hero">
          <div className="left">
            <span className="ticker-big">{meta.ticker}</span>
            <span className="name-big">{meta.displayName} &mdash; Archive</span>
          </div>
        </div>
      </div>

      {groups.length === 0 && (
        <div className="loading">No archived briefings yet for {meta.displayName}.</div>
      )}

      {groups.map((g) => (
        <div key={g.month} className="archive-month-group">
          <div className="archive-month-label">{formatMonth(g.month)}</div>
          <ul className="archive-list">
            {g.dates.map((date) => (
              <li key={date}>
                <Link href={`/asset/${slug}/${date}`}>{date}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
