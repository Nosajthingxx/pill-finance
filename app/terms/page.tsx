import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for pill.finance.',
};

export default function TermsPage() {
  return (
    <div className="portfolio-page portfolio-page-narrow legal-page">
      <div className="portfolio-eyebrow">PILL.FINANCE</div>
      <h1 className="portfolio-title">Terms of Use</h1>
      <p className="legal-meta">Last updated: 12 May 2026</p>

      <p>By using pill.finance you agree to these terms. They are short on purpose.</p>

      <h2>What this is</h2>
      <p>
        pill.finance publishes short market briefings on 19 assets, twice a day, Monday-Friday.
        Logged-in users can also track their own portfolio (manual entry of buys, sells, and shorts)
        and request additional assets via a community voting page.
      </p>

      <h2>Not investment advice</h2>
      <p>
        Everything on pill.finance is for general informational purposes only. It is not personal
        financial, investment, tax, or legal advice. Do your own research and consult a licensed
        professional before making decisions about money. Past performance does not guarantee future
        results.
      </p>

      <h2>Portfolio tracker</h2>
      <p>
        The portfolio tracker is a record of what you tell us you hold. We do not execute trades,
        hold custody of any assets, or have any connection to a broker. Prices used for P/L
        calculations come from our twice-daily briefings and are indicative, not live tradable
        quotes.
      </p>

      <h2>Account use</h2>
      <ul>
        <li>You are responsible for keeping access to your email account secure.</li>
        <li>One account per person. Do not share access.</li>
        <li>Do not try to break, scrape, or attack the site.</li>
      </ul>

      <h2>Termination</h2>
      <p>
        You can delete your account any time from your{' '}
        <Link href="/account" className="legal-link">account page</Link>. We can suspend an account
        that abuses the service. Free Phase 1 has no SLA -- we will do our best to keep things up.
      </p>

      <h2>Liability</h2>
      <p>
        pill.finance is provided as is. To the maximum extent allowed by law, we are not liable for
        any loss arising from your use of the site, including financial losses based on our content
        or your portfolio tracking.
      </p>

      <h2>Contact</h2>
      <p>Email <strong>onay.selim@gmail.com</strong> for anything.</p>

      <p className="legal-footer">
        <Link href="/privacy" className="legal-link">Privacy Policy</Link>{' '}&middot;{' '}
        <Link href="/" className="legal-link">Home</Link>
      </p>
    </div>
  );
}
