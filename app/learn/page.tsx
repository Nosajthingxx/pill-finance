import type { Metadata } from 'next';
import Link from 'next/link';
import { ASSETS, CATEGORIES } from '@/lib/slugs';
import '../routes.css';

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'In-depth explainers for every asset on pill.finance, plus a trading glossary.',
  alternates: { canonical: 'https://pill.finance/learn' },
};

export default function LearnPage() {
  return (
    <>
      <div className="page-hero">
        <h1>// LEARN</h1>
        <p className="headline">
          Understand the assets you <span className="accent">trade and track</span>
        </p>
        <p className="sub">
          In-depth explainers for all 19 assets, plus a trading glossary
        </p>
      </div>

      <section className="category-block">
        <div className="category-header">
          <div className="left">
            <span className="category-name">GLOSSARY</span>
            <span className="category-count">TRADING TERMS</span>
          </div>
        </div>
        <div className="learn-grid">
          <Link href="/learn/glossary">
            <div className="learn-title">Trading Glossary</div>
            <div className="learn-sub">
              Pip, spread, leverage, margin, and more — essential trading terms defined
            </div>
          </Link>
        </div>
      </section>

      {CATEGORIES.map(cat => (
        <section key={cat.key} className="category-block">
          <div className="category-header">
            <div className="left">
              <span className="category-name">{cat.label}</span>
              <span className="category-count">{cat.countLabel}</span>
            </div>
          </div>
          <div className="learn-grid">
            {cat.slugs.map(slug => {
              const asset = ASSETS.find(a => a.slug === slug);
              if (!asset) return null;
              return (
                <Link key={slug} href={`/learn/${slug}`}>
                  <div className="learn-title">What is {asset.commonName}?</div>
                  <div className="learn-sub">{asset.disambiguation}</div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
