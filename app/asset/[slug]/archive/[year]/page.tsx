import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_SLUGS, getAsset } from '@/lib/slugs';
import { listArchivesFor, listArchiveYears } from '@/lib/briefings';
import '../../../asset.css';

interface PageProps {
  params: Promise<{ slug: string; year: string }>;
}

export async function generateStaticParams() {
  const years = await listArchiveYears();
  const params: { slug: string; year: string }[] = [];
  for (const slug of ALL_SLUGS) {
    for (const year of years) {
      params.push({ slug, year });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, year } = await params;
  const meta = getAsset(slug);
  if (!meta) return {};

  return {
    title: `${meta.shortName} Archive -- ${year}`,
    description: `${meta.commonName} briefings from ${year}.`,
    alternates: { canonical: `https://pill.finance/asset/${slug}/archive/${year}` },
  };
}

/** Group dates by YYYY-MM within the year. */
function groupByMonth(dates: string[]): { month: string; label: string; dates: string[] }[] {
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const map = new Map<string, string[]>();
  for (const d of dates) {
    const ym = d.slice(0, 7);
    if (!map.has(ym)) map.set(ym, []);
    map.get(ym)!.push(d);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([ym, dates]) => ({
      month: ym,
      label: months[parseInt(ym.slice(5, 7), 10) - 1],
      dates,
    }));
}

export default async function ArchiveYearPage({ params }: PageProps) {
  const { slug, year } = await params;
  const meta = getAsset(slug);
  if (!meta) notFound();

  // Validate year format
  if (!/^\d{4}$/.test(year)) notFound();

  const allDates = await listArchivesFor(slug);
  const yearDates = allDates.filter((d) => d.startsWith(year));

  if (yearDates.length === 0) notFound();

  const groups = groupByMonth(yearDates);

  return (
    <>
      <div className="detail-header">
        <div className="detail-breadcrumb">
          <Link href="/">HOME</Link>
          {' > '}
          <Link href={`/asset/${slug}`}>{meta.shortName.toUpperCase()}</Link>
          {' > '}
          <Link href={`/asset/${slug}/archive`}>ARCHIVE</Link>
          {' > '}
          <span>{year}</span>
        </div>

        <div className="detail-hero">
          <div className="left">
            <span className="ticker-big">{meta.ticker}</span>
            <span className="name-big">{meta.displayName} &mdash; {year}</span>
          </div>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.month} className="archive-month-group">
          <div className="archive-month-label">{g.label} {year}</div>
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
