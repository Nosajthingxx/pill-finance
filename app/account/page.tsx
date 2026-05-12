import Link from 'next/link';
import { requireUserId } from '@/lib/auth-helpers';
import { getUserByIdForUser } from '@/lib/db/users';
import AccountForm from '@/components/account/AccountForm';
import DeleteAccountButton from '@/components/account/DeleteAccountButton';

export const metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const userId = await requireUserId();
  const user = await getUserByIdForUser(userId);

  return (
    <div className="portfolio-page portfolio-page-narrow">
      <div className="portfolio-header">
        <div>
          <div className="portfolio-eyebrow">PILL.FINANCE / ACCOUNT</div>
          <h1 className="portfolio-title">Your account</h1>
        </div>
        <Link href="/portfolio" className="portfolio-link-secondary">
          ← Dashboard
        </Link>
      </div>

      <section className="account-section">
        <h2 className="portfolio-h2">Profile</h2>
        <p className="portfolio-muted">Email: {user?.email}</p>
        <AccountForm defaultName={user?.name ?? null} />
      </section>

      <section className="account-section">
        <h2 className="portfolio-h2">Export your data</h2>
        <p className="portfolio-muted">
          Download everything we have on you as a JSON file: profile, transactions, and asset requests.
        </p>
        <a href="/api/account/export" className="portfolio-cta" style={{ display: 'inline-block', marginTop: 8 }}>
          Download export (JSON)
        </a>
      </section>

      <section className="account-section account-danger">
        <h2 className="portfolio-h2">Delete your account</h2>
        <p className="portfolio-muted">
          We mark your account for deletion immediately and log you out. For 30 days you can sign back in to
          recover everything. After 30 days, your data is permanently deleted.
        </p>
        <DeleteAccountButton />
      </section>

      <section className="account-section">
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="portfolio-link-secondary" style={{ background: 'transparent', cursor: 'pointer' }}>
            Sign out
          </button>
        </form>
      </section>
    </div>
  );
}
