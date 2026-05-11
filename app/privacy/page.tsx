import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for pill.finance. No tracking, no data sales, no unnecessary cookies.',
};

export default function PrivacyPage() {
  return (
    <div className="static-page">
      <h1>Privacy Policy</h1>
      <p className="subtitle">Last updated: 10 May 2026</p>

      <h2>Overview</h2>
      <p>
        pill.finance is committed to protecting your privacy. This policy
        explains what data we collect, how we use it, and your rights.
      </p>

      <h2>Data We Collect</h2>
      <p>
        We collect minimal data necessary to operate the site. This includes
        basic server-side analytics such as page views and referrer information.
        We do not collect personal information, email addresses, or any form of
        user-identifiable data unless you voluntarily contact us.
      </p>

      <h2>Cookies</h2>
      <p>
        pill.finance uses only essential cookies required for basic site
        functionality. We do not use advertising cookies, tracking pixels, or
        third-party analytics that profile individual users.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        The site may use basic, privacy-respecting analytics to understand
        aggregate traffic patterns. No data is shared with third parties for
        advertising or profiling purposes.
      </p>

      <h2>Data Sales</h2>
      <p>
        We do not sell, rent, or trade any user data to third parties. Period.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request information about any data we hold related to your
        visit, or request its deletion. Contact us at{' '}
        <a href="mailto:hello@pill.finance">hello@pill.finance</a>.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. Material changes will be
        noted on this page with an updated revision date.
      </p>
    </div>
  );
}
