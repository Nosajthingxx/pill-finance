import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../../routes.css';

interface Props {
  params: Promise<{ term: string }>;
}

const GLOSSARY: Record<string, { definition: string; context: string }> = {
  pip: {
    definition: 'A pip (percentage in point) is the smallest standard price increment in a currency pair.',
    context: 'For most FX pairs, one pip equals 0.0001. For JPY pairs, one pip equals 0.01.',
  },
  leverage: {
    definition: 'Leverage allows traders to control a larger position size using a fraction of the capital.',
    context: 'Common leverage ratios range from 1:10 to 1:500 depending on broker and regulation.',
  },
  spread: {
    definition: 'The spread is the difference between the bid (sell) price and the ask (buy) price.',
    context: 'Tighter spreads indicate higher liquidity. Spreads widen during volatile or low-liquidity periods.',
  },
  margin: {
    definition: 'Margin is the collateral required by a broker to open and maintain a leveraged position.',
    context: 'If your account equity falls below the maintenance margin, a margin call may be triggered.',
  },
  lot: {
    definition: 'A lot is the standardized unit of measurement for trade size in financial markets.',
    context: 'In FX, a standard lot is 100,000 units, a mini lot is 10,000, and a micro lot is 1,000.',
  },
  volatility: {
    definition: 'Volatility measures the degree of price variation of an asset over a given time period.',
    context: 'Higher volatility means larger price swings. The VIX index measures S&P 500 implied volatility.',
  },
  liquidity: {
    definition: 'Liquidity refers to how quickly and easily an asset can be bought or sold without significantly moving the price.',
    context: 'Major FX pairs like EUR/USD are among the most liquid instruments. Low-cap stocks are less liquid.',
  },
  correlation: {
    definition: 'Correlation measures the statistical relationship between the price movements of two assets.',
    context: 'A correlation of +1 means assets move together; -1 means they move inversely; 0 means no relationship.',
  },
  support: {
    definition: 'Support is a price level where buying interest is historically strong enough to prevent further decline.',
    context: 'Traders watch support levels for potential entry points. A break below support can signal further downside.',
  },
  resistance: {
    definition: 'Resistance is a price level where selling pressure is historically strong enough to prevent further advance.',
    context: 'A break above resistance can signal bullish momentum. Former resistance often becomes new support.',
  },
};

const VALID_TERMS = Object.keys(GLOSSARY);

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function generateStaticParams() {
  return VALID_TERMS.map(term => ({ term }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  if (!GLOSSARY[term]) return { title: 'Not Found' };
  return {
    title: `What is a ${capitalize(term)}?`,
    description: GLOSSARY[term].definition,
    alternates: { canonical: `https://pill.finance/learn/glossary/${term}` },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const entry = GLOSSARY[term];
  if (!entry) notFound();

  return (
    <>
      <div className="detail-breadcrumb">
        <Link href="/learn">Learn</Link> / <Link href="/learn/glossary">Glossary</Link> / {capitalize(term)}
      </div>

      <div className="page-hero">
        <h1>// GLOSSARY</h1>
        <p className="headline">
          What is a <span className="accent">{capitalize(term)}</span>?
        </p>
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '28px 28px 32px',
        maxWidth: '680px',
      }}>
        <div style={{
          fontSize: '16px',
          color: 'var(--text)',
          lineHeight: '1.7',
          marginBottom: '16px',
        }}>
          {entry.definition}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-dim)',
          lineHeight: '1.6',
          borderTop: '1px dashed var(--border)',
          paddingTop: '14px',
        }}>
          {entry.context}
        </div>
        <p style={{
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'var(--text-faint)',
          marginTop: '20px',
        }}>
          Full definition coming soon
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
        <Link href="/learn/glossary" className="back-link">← All terms</Link>
        <Link href="/learn" className="back-link">← Back to Learn</Link>
      </div>
    </>
  );
}
