// Layout for all /portfolio/* routes. Middleware already enforces auth,
// but we add a defense-in-depth check here so any direct render is also guarded.

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-helpers';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect('/login');

  return <div className="portfolio-shell">{children}</div>;
}
