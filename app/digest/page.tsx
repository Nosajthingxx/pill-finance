import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { readLatestPointer } from '@/lib/briefings';
import '../routes.css';

export const metadata: Metadata = {
  title: 'Daily Digest',
  description:
    'All 19 assets in one page. Past, why, watch — the full daily briefing.',
  alternates: { canonical: 'https://pill.finance/digest' },
};

export default async function DigestRedirectPage() {
  const ptr = await readLatestPointer();

  if (ptr) {
    redirect(`/digest/${ptr.latest_date}`);
  }

  return (
    <>
      <div className="page-hero">
        <h1>// DAILY DIGEST</h1>
        <p className="headline">No digests yet</p>
        <p className="sub">
          The first AM run will generate the inaugural digest.
        </p>
      </div>
      <div className="placeholder-box">
        <p>Digests will appear here once briefing data is available.</p>
        <p className="coming-soon">Check back after the first market day refresh</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link href="/" className="back-link">← Back to home</Link>
      </div>
    </>
  );
}
