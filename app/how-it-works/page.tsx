import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'How pill.finance generates twice-daily market briefings: AI-powered analysis of 19 assets using the Past / Why / Watch framework.',
};

export default function HowItWorksPage() {
  return (
    <div className="static-page">
      <h1>How It Works</h1>
      <p className="subtitle">
        From raw data to actionable intelligence, twice a day.
      </p>

      <h2>Schedule</h2>
      <p>
        Briefings are generated twice daily, Monday through Friday, at 06:30
        and 19:00 TRT (Turkey Time, UTC+3). The morning run captures the
        overnight session and Asian open; the evening run covers the European
        and US sessions.
      </p>

      <h2>Coverage</h2>
      <p>
        Each run analyses 19 assets across five categories: 4 FX pairs, 3
        commodities, 3 indices, 2 crypto assets, and 7 mega-cap stocks. The
        asset list is curated by domain experts and locked to ensure consistent
        coverage.
      </p>

      <h2>The Past / Why / Watch Framework</h2>
      <p>
        Every asset briefing follows a three-part structure:
      </p>
      <ul>
        <li>
          <strong style={{ color: 'var(--blue)' }}>Past</strong> -- What
          happened since the last update. Price action, volume, key moves.
        </li>
        <li>
          <strong style={{ color: 'var(--amber)' }}>Why</strong> -- The drivers
          behind the move. Macro events, earnings, policy shifts, flows.
        </li>
        <li>
          <strong style={{ color: 'var(--lime)' }}>Watch</strong> -- What comes
          next. Key levels, upcoming catalysts, and scenarios to monitor.
        </li>
      </ul>

      <h2>Data Sources</h2>
      <p>
        Our analysis draws from real-time price feeds, financial news wires,
        macro indicators (DXY, US 10Y, VIX), and earnings calendars. Data is
        aggregated and processed at each scheduled run.
      </p>

      <h2>Transparency</h2>
      <p>
        pill.finance briefings are AI-generated content. The asset selection is
        human-curated and the analysis framework is designed by market
        professionals, but the text itself is produced by purpose-built AI
        systems. We believe in full transparency about our methodology.
      </p>
      <p>
        Changes to our methodology are documented in the{' '}
        <Link href="/changelog">changelog</Link>.
      </p>
    </div>
  );
}
