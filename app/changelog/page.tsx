import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'Public log of methodology and coverage changes at pill.finance.',
};

interface ChangelogEntry {
  date: string;
  title: string;
  body: string;
}

const entries: ChangelogEntry[] = [
  {
    date: '2026-05-10',
    title: 'Launch',
    body: 'pill.finance goes live with 19 assets and twice-daily briefings. Coverage spans 4 FX pairs, 3 commodities, 3 indices, 2 crypto assets, and 7 mega-cap stocks. Briefings run at 06:30 and 19:00 TRT, Monday through Friday.',
  },
];

export default function ChangelogPage() {
  return (
    <div className="static-page">
      <h1>Changelog</h1>
      <p className="subtitle">
        Methodology and coverage changes, documented publicly.
      </p>

      <div style={{ marginTop: 32 }}>
        {entries.map((entry) => (
          <div
            key={entry.date}
            style={{
              borderLeft: '2px solid var(--lime)',
              paddingLeft: 20,
              marginBottom: 32,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                color: 'var(--text-faint)',
                letterSpacing: '0.5px',
                marginBottom: 4,
              }}
            >
              {entry.date}
            </p>
            <p
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 8,
              }}
            >
              {entry.title}
            </p>
            <p>{entry.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
