import Link from 'next/link';
import type { AssetBriefing } from '@/lib/types';
import type { AssetMeta } from '@/lib/slugs';

interface Props {
  meta: AssetMeta;
  briefing: AssetBriefing | undefined;
}

export default function AssetCard({ meta, briefing }: Props) {
  const dir = briefing?.change_pct == null ? '' : briefing.change_pct >= 0 ? 'up' : 'down';
  const arrow = briefing?.change_pct == null ? '' : briefing.change_pct >= 0 ? '▲' : '▼';
  const sign = briefing?.change_pct != null && briefing.change_pct >= 0 ? '+' : '';
  const change =
    briefing?.change_pct == null
      ? '—'
      : `${arrow} ${sign}${briefing.change_pct.toFixed(2)}%`;

  const teaser = briefing?.sections?.[0]?.past || 'Awaiting first refresh.';

  return (
    <Link
      href={`/asset/${meta.slug}`}
      className="asset-card"
      aria-label={`${meta.displayName} briefing`}
    >
      <div className="row1">
        <span className="ticker">{meta.ticker}</span>
        <span className="read-arrow" aria-hidden="true">→</span>
      </div>
      <span className="name">{meta.displayName}</span>
      <span className="price">{briefing?.price_display || '—'}</span>
      <span className={`change ${dir}`}>{change}</span>
      <div className="briefing-teaser">{teaser}</div>
    </Link>
  );
}
