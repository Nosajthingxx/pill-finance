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
        <li><strong>Email address.</strong> Required to log you in (we send a one-click sign-in link). No passwords stored.</li>
        <li><strong>Display name (optional).</strong> Only if you fill it in on your account page.</li>
        <li><strong>Portfolio data.</strong> Transactions you record (asset, side, quantity, price, date, optional note) and tickers you request through the voting page.</li>
        <li><strong>Session cookies.</strong> A signed cookie that tells our server you are logged in. No third-party trackers.</li>
      </ul>

      <h2>Why we collect it</h2>
      <ul>
        <li>To authenticate you and let you access your portfolio across sessions.</li>
        <li>To compute and show your P/L.</li>
        <li>To aggregate asset-request votes (anonymous counts) so we know what to add next.</li>
      </ul>

      <h2>Who we share with</h2>
      <p>Three vendors, and nobody else:</p>
      <ul>
        <li><strong>Vercel</strong> -- hosting and database (Vercel Postgres / Neon).</li>
        <li><strong>Resend</strong> -- sending sign-in link emails.</li>
        <li><strong>You</strong> -- your own data, on demand via the data export.</li>
      </ul>
      <p>We do not sell data. We do not use ad networks. We do not track across sites.</p>

      <h2>How long we keep it</h2>
      <p>
        Until you delete your account, plus a 30-day grace period. After 30 days, your account row
        and all transactions and asset requests are physically deleted from the database (daily cron).
      </p>

      <h2>Your rights</h2>
      <ul>
        <li><strong>Access / export.</strong> Visit your <Link href="/account" className="legal-link">account page</Link> and click Download export.</li>
        <li><strong>Delete.</strong> Same page, click Delete my account. Physical deletion after 30 days.</li>
        <li><strong>Correct.</strong> Edit any transaction yourself on the transactions page.</li>
      </ul>

      <h2>Where we are</h2>
      <p>Your data is stored on Vercel Postgres in Frankfurt, Germany (EU region). Email is sent via Resend.</p>

      <h2>Children</h2>
      <p>pill.finance is not directed at people under 18. We do not knowingly collect data from minors.</p>

      <h2>Changes</h2>
      <p>Material changes will be posted on the homepage with an updated revision date.</p>

      <h2>Contact</h2>
      <p>Email <strong>onay.selim@gmail.com</strong> for any privacy question.</p>

      <p className="legal-footer">
        <Link href="/terms" className="legal-link">Terms of Use</Link>{' '}|{' '}
        <Link href="/" className="legal-link">Home</Link>
      </p>
    </div>
  );
}
