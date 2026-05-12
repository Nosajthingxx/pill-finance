import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign-in problem',
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'There is a problem with our sign-in configuration. Please try again in a few minutes.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign-in link is invalid or has expired. Request a new one below.',
  Default: "Something went wrong. Let's try again.",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorKey = searchParams.error || 'Default';
  const message = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.Default;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">PILL.FINANCE</div>
        <h1 className="auth-title">Sign-in problem</h1>
        <p className="auth-subtitle">{message}</p>
        <a href="/login" className="auth-button">Try again</a>
      </div>
    </div>
  );
}
