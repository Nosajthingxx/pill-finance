import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How pill.finance handles your data: what we collect, why, and how to delete it.',
};

export default function PrivacyPage() {
  return (
    <div className="portfolio-page portfolio-page-narrow legal-page">
      <div className="portfolio-eyebrow">PILL.FINANCE</div>
      <h1 className="portfolio-title">Privacy Policy</h1>
      <p className="legal-meta">Last updated: 12 May 2026</p>

      <p>
        pill.finance is a market-briefing site. Most of it is anonymous reading. If you create
        an account to use the portfolio tracker, this page explains what we collect and what
        rights you have.
      </p>

      <h2>What we collect</h2>
      <p>From people who create an account:</p>
      <ul>
        <li>
          <strong>Email address.</strong> Required to log you in (we send you a one-click sign-in
          link). We never store your password — there is no password.
        </li>
        <li>
          <strong>Display name (optional).</strong> Only if you fill it in on your account page.
        </li>
        <li>
          <strong>Portfolio data you enter.</strong> Transactions you record (asset, side, quantity,
          price, date, optional note) and tickers you request through the asset-request voting page.
        </li>
        <li>
          <strong>Session cookies.</strong> A signed cookie that tells our server you're logged in.
          No third-party trackers.
        </li>
      </ul>

      <h2>Why we collect it</h2>
      <ul>
        <li>To authenticate you and let you access your portfolio across sessions.</li>
        <li>To compute and show your P/L.</li>
        <li>
          To aggregate asset-request votes (in counted, anonymous form) so we know what to add next.
        </li>
      </ul>

      <h2>Who we share with</h2>
      <p>Three vendors, and nobody else:</p>
      <ul>
        <li>
       