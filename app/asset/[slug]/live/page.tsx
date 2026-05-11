import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ALL_SLUGS, getAsset } from '@/lib/slugs';
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
    title: `${meta.shortName} Live`,
    description: `Live view for ${meta.commonName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function LivePage({ params }: PageProps) {
  const { slug } = await params;
  const meta = getAsset(slug);
  if (!meta) notFound();

  return (
    <>
      <div className="detail-header">
        <div className="detail-breadcrumb">
          <Link href="/">HOME</Link>
          {' > '}
          <Link href={`/asset/${slug}`}>{meta.shortName.toUpperCase()}</Link>
          {' > '}
          <span>LIVE</span>
        </div>

        <div className="detail-hero">
          <div className="left">
            <span className="ticker-big">{meta.ticker}</span>
            <span className="name-big">{meta.displayName}</span>
          </div>
        </div>
      </div>

      <div className="placeholder-state">
        <h2>LIVE VIEW</h2>
        <p>Live view coming soon.</p>
        <p style={{ marginTop: 16 }}>
          <Link
            href={`/asset/${slug}`}
            style={{ color: 'var(--lime)', fontFamily: 'var(--mono)', fontSize: 12 }}
          >
            &larr; BACK TO {meta.shortName.toUpperCase()} HUB
          </Link>
        </p>
      </div>
    </>
  );
}
