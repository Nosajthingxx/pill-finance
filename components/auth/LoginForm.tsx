'use client';

import { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';

interface Props {
  callbackUrl?: string;
}

export default function LoginForm({ callbackUrl }: Props) {
  const [email, setEmail] = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    startTransition(async () => {
      try {
        await signIn('resend', {
          email: trimmed,
          callbackUrl: callbackUrl || '/portfolio',
          redirect: true,
        });
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="auth-input"
        placeholder="you@example.com"
        autoComplete="email"
        autoFocus
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={pending}
      />
      <button type="submit" className="auth-submit" disabled={pending || !email}>
        {pending ? 'Sending link…' : 'Send magic link'}
      </button>
      {error && <p className="auth-error">{error}</p>}
    </form>
  );
}
