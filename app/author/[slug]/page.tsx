import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../routes.css';

interface Props {
  params: Promise<{ slug: string }>;
}

const AUTHORS: Record<string, {
  name: string;
  role: string;
  bio: string[];
  links: { label: string; href: string }[];
}> = {
  'selim-onay': {
    name: 'Selim Onay',
    role: 'Founder',
    bio: [
      'Selim Onay is the founder of pill.finance, building skim-and-go market intelligence for traders and investors who want signal without noise.',
      'With deep experience in forex broker operations, Selim understands the infrastructure that powers retail trading. He co-founded FXHelpDesk, providing operational support and consulting services to forex brokerages worldwide.',
      'pill.finance is his latest venture: a twice-daily briefing covering 19 assets across FX, commodities, indices, crypto, and stocks. The goal is simple -- tell you what happened, why it matters, and what to watch, in 10 minutes flat.',
    ],
    links: [
      { label: 'pill.finance', href: 'https://pill.finance' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = AUTHORS[slug];
  if (!author) return { title: 'Not Found' };
  return {
    title: author.name,
    description: `${author.name} -- ${author.role} of pill.finance.`,
    alternates: { canonical: `https://pill.finance/author/${slug}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = AUTHORS[slug];
  if (!author) notFound();

  return (
    <>
      <Link href="/" className="back-link">← Home</Link>

      <div className="author-card">
        <div className="author-name">{author.name}</div>
        <div className="author-role">{author.role}</div>
        {author.bio.map((paragraph, i) => (
          <p key={i} className="author-bio">{paragraph}</p>
        ))}
        {author.links.length > 0 && (
          <div className="author-links">
            {author.links.map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
