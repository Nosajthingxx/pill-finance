import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_SLUGS, getAsset } from '@/lib/slugs';
import '../../routes.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const asset = getAsset(slug);
  if (!asset) return { title: 'Not Found' };
  return {
    title: `What is ${asset.commonName}?`,
    description: `In-depth explainer for ${asset.commonName} (${asset.ticker}). ${asset.disambiguation}`,
    alternates: { canonical: `https://pill.finance/learn/${slug}` },
  };
}

export default async function LearnAssetPage({ params }: Props) {
  const { slug } = await params;
  const asset = getAsset(slug);
  if (!asset) notFound();

  return (
    <>
      <div className="detail-breadcrumb">
        <Link href="/learn">Learn</Link> / {asset.commonName}
      </div>

      <div className="page-hero">
        <h1>// LEARN | {asset.ticker}</h1>
        <p className="headline">
          What is <span className="accent">{asset.commonName}</span>?
        </p>
        <p className="sub">{asset.disambiguation}</p>
      </div>

      <div className="placeholder-box">
        <p>In-depth explainer for {asset.displayName} coming soon.</p>
        <p className="coming-soon">Content in development</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
        <Link href={`/asset/${slug}`} className="back-link">
          ← {asset.ticker} briefing
        </Link>
        <Link href="/learn" className="back-link">
          ← All explainers
        </Link>
      </div>
    </>
  );
}
