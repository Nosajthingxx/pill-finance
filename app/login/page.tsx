import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Sign in to pill.finance with a one-click email link.',
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">PILL.FINANCE</div>
        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">
          We'll email you a one-click sign-in link. No password.
        </p>
        <LoginForm callbackUrl={searchParams.callbackUrl} />
        {searchParams.error && (
          <p className="auth-error">
            {decodeURIComponent(searchParams.error)}
          </p>
        )}
        <p className="auth-fineprint">
          New here? Just enter your email — we'll create your account when you click the link.
        </p>
      </div>
    </div>
  );
}
