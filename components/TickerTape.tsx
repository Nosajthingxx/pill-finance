// Marquee ticker tape -- duplicated content for seamless CSS-driven scroll loop.
// Server component; receives the latest day briefing as a prop, renders a string of items.

import type { DayBriefing } from '@/lib/types';
import { ASSETS } from '@/lib/slugs';

interface Props {
  briefing: DayBriefing | null;
}

export default function TickerTape({ briefing }: Props) {
  const items = ASSETS.map(meta => {
    const a = briefing?.assets[meta.slug];
    if (!a) {
      return (
        <span key={meta.slug} className="ticker-item">
          <span className="sym">{meta.ticker}</span>
          <span className="px">--</span>
        </span>
      );
    }
    const dir = a.change_pct == null ? '' : a.change_pct >= 0 ? 'up' : 'down';
    const ch =
      a.change_pct == null
        ? '--'
        : (a.change_pct >= 0 ? '+' : '') + a.change_pct.toFixed(2) + '%';
    return (
      <span key={meta.slug} className="ticker-item">
        <span className="sym">{meta.ticker}</span>
        <span className="px">{a.price_display || '--'}</span>
        <span className={`ch ${dir}`}>{ch}</span>
      </span>
    );
  });

  // Doubled for seamless infinite scroll (CSS keyframes translate -50%)
  return (
    <div className="ticker-tape" aria-hidden="true">
      <div className="ticker-track">
        {items}
        {items}
      </div>
    </div>
  );
}
