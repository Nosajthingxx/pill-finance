import Link from 'next/link';

export const metadata = {
  title: 'Account deleted',
  robots: { index: false, follow: false },
};

export default function AccountDeletedPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">PILL.FINANCE</div>
        <h1 className="auth-title">Account deleted</h1>
        <p className="auth-subtitle">
          Your account has been marked for deletion. You've been logged out.
        </p>
        <div className="auth-callout">
          <strong>Changed your mind?</strong>
          <ul>
            <li>For the next 30 days, sign in again with the same email to recover everything.</li>
            <li>After 30 days, all your data is permanently deleted and cannot be restored.</li>
          </ul>
        </div>
        <Link href="/" className="auth-link">← Back to pill.finance</Link>
      </div>
    </div>
  );
}
