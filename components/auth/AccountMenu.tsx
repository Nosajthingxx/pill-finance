// Server Component -- reads the session on the server and renders the appropriate
// header button. Either "LOG IN" (anon) or "PORTFOLIO" (signed in).

import Link from 'next/link';
import { getSession } from '@/lib/auth-helpers';

export default async function AccountMenu() {
  const session = await getSession();

  if (!session?.user) {
    return (
      <Link href="/login" className="account-button">
        LOG IN
      </Link>
    );
  }

  return (
    <span className="account-menu">
      <Link href="/portfolio" className="account-button">PORTFOLIO</Link>
      <Link href="/account" className="account-button-secondary" aria-label="Account settings">*</Link>
    </span>
  );
}
