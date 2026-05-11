import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TickerTape from '@/components/TickerTape';
import { readLatestBriefing } from '@/lib/briefings';

export const metadata: Metadata = {
  metadataBase: new URL('https://pill.finance'),
  title: {
    default: 'pill.finance — skim-and-go market intelligence',
    template: '%s · pill.finance',
  },
  description:
    'What happened, why it matters, what to watch. 19 assets across FX, commodities, indices, crypto, and stocks. Twice daily, Monday–Friday. 10 minutes flat.',
  applicationName: 'pill.finance',
  authors: [{ name: 'Selim Onay' }],
  creator: 'Selim Onay',
  publisher: 'pill.finance',
  openGraph: {
    type: 'website',
    siteName: 'pill.finance',
    title: 'pill.finance — skim-and-go market intelligence',
    description:
      'One click per asset. Past, why, watch. Twice daily, Monday–Friday.',
    url: 'https://pill.finance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pill.finance — skim-and-go market intelligence',
    description:
      'One click per asset. Past, why, watch. Twice daily, Monday–Friday.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0E14',
  colorScheme: 'dark',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the latest briefing once at the layout level so the ticker tape
  // and header status pill stay in sync site-wide.
  const briefing = await readLatestBriefing();

  return (
    <html lang="en">
      <body>
        <TickerTape briefing={briefing} />
        <Header briefing={briefing} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
