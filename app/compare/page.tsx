import type { Metadata } from 'next';
import Link from 'next/link';
import { ALL_SLUGS, getAsset } from '@/lib/slugs';
import '../routes.css';

export const metadata: Metadata = {
  title: 'Compare Assets',
  description:
    'Compare any two assets side by side. 171 pairs across FX, commodities, indices, crypto, and stocks.',
  alternates: { canonical: 'https://pill.finance/compare' },
};

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

export default function ComparePage() {
  const pairs = generateAllPairs();

  return (
    <>
      <div className="page-hero">
        <h1>// COMPARE ASSETS</h1>
        <p className="headline">
          <span className="accent">{pairs.length} pairs</span> -- pick any two
        </p>
        <p className="sub">
          Side-by-side briefings for every possible combination of 19 assets
        </p>
      </div>

      <div className="compare-grid">
        {pairs.map(({ slugA, slugB }) => {
          const a = getAsset(slugA);
          const b = getAsset(slugB);
          if (!a || !b) return null;
          return (
            <Link
              key={`${slugA}-vs-${slugB}`}
              href={`/compare/${slugA}-vs-${slugB}`}
            >
              {a.shortName}
              <span className="vs">vs</span>
              {b.shortName}
            </Link>
          );
        })}
      </div>
    </>
  );
}
