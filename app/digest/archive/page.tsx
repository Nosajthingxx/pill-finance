import type { Metadata } from 'next';
import Link from 'next/link';
import { listAvailableDates } from '@/lib/briefings';
import '../../routes.css';

export const metadata: Metadata = {
  title: 'Digest Archive',
  description:
    'Browse all daily market digests. Every briefing date with full 19-asset coverage.',
  alternates: { canonical: 'https://pill.finance/digest/archive' },
};

export default async function DigestArchivePage() {
  const dates = await listAvailableDates();

  // Group dates by month for readability
  const byMonth: Record<string, string[]> = {};
  for (const d of dates) {
    const month = d.slice(0, 7); // "2026-05"
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(d);
  }
  const months = Object.keys(byMonth).sort().reverse();

  return (
    <>
      <div className="page-hero">
        <h1>// DIGEST ARCHIVE</h1>
        <p className="headline">
          Every daily digest, <span className="accent">all in one place</span>
        </p>
        <p className="sub">
          {dates.length} digest{dates.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {dates.length === 0 ? (
        <div className="placeholder-box">
          <p>No digests available yet.</p>
          <p className="coming-soon">Check back after the first market day refresh</p>
        </div>
      ) : (
        months.map(month => (
          <section key={month} className="category-block">
            <div className="category-header">
              <div className="left">
                <span className="category-name">{month}</span>
                <span className="category-count">
                  {byMonth[month].length} DAY{byMonth[month].length !== 1 ? 'S' : ''}
                </span>
              </div>
            </div>
            <ul className="archive-list">
              {byMonth[month].map(date => (
                <li key={date}>
                  <Link href={`/digest/${date}`}>{date}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <div style={{ marginTop: '20px' }}>
        <Link href="/" className="back-link">← Back to home</Link>
      </div>
    </>
  );
}
