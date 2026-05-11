import type { Metadata } from 'next';
import Link from 'next/link';
import '../../routes.css';

export const metadata: Metadata = {
  title: 'Glossary',
  description:
    'Essential trading and market terms explained. Pip, leverage, spread, margin, and more.',
  alternates: { canonical: 'https://pill.finance/learn/glossary' },
};

const GLOSSARY_TERMS = [
  { term: 'pip', preview: 'The smallest price increment in a currency pair' },
  { term: 'leverage', preview: 'Using borrowed capital to amplify position size' },
  { term: 'spread', preview: 'The difference between bid and ask price' },
  { term: 'margin', preview: 'Capital required to open and maintain a position' },
  { term: 'lot', preview: 'Standard unit of measurement for trade size' },
  { term: 'volatility', preview: 'Degree of price variation over time' },
  { term: 'liquidity', preview: 'How easily an asset can be bought or sold' },
  { term: 'correlation', preview: 'Statistical relationship between two assets' },
  { term: 'support', preview: 'Price level where buying pressure tends to emerge' },
  { term: 'resistance', preview: 'Price level where selling pressure tends to emerge' },
] as const;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function GlossaryPage() {
  return (
    <>
      <div className="detail-breadcrumb">
        <Link href="/learn">Learn</Link> / Glossary
      </div>

      <div className="page-hero">
        <h1>// GLOSSARY</h1>
        <p className="headline">
          Trading terms, <span className="accent">demystified</span>
        </p>
        <p className="sub">
          {GLOSSARY_TERMS.length} essential terms every trader should know
        </p>
      </div>

      <ul className="glossary-list">
        {GLOSSARY_TERMS.map(({ term, preview }) => (
          <li key={term}>
            <Link href={`/learn/glossary/${term}`}>
              <span className="term">{capitalize(term)}</span>
              <span className="preview">{preview}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '20px' }}>
        <Link href="/learn" className="back-link">← Back to Learn</Link>
      </div>
    </>
  );
}
