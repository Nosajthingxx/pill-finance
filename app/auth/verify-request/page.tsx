import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Check your email',
  description: 'A sign-in link has been sent to your email.',
  robots: { index: false, follow: false },
};

export default function VerifyRequestPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">PILL.FINANCE</div>
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-subtitle">
          We've sent you a one-click sign-in link. Click it to log in.
        </p>
        <div className="auth-callout">
          <strong>Didn't get it?</strong>
          <ul>
            <li>Check your spam / promotions folder</li>
            <li>The link expires after 24 hours</li>
            <li>Wait a few seconds -- email can take up to a minute</li>
          </ul>
        </div>
        <a href="/login" className="auth-link">← Try a different email</a>
      </div>
    </div>
  );
}
