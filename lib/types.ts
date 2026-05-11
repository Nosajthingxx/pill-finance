// Shared TypeScript types for pill.finance.
// Mirrors the per-day JSON schema documented in docs/12-nextjs-migration-plan.md.

export type AssetCategory = 'fx' | 'commodities' | 'indices' | 'crypto' | 'stocks';

export type UpdateSlot = 'am' | 'pm' | 'midday' | 'close' | 'event';

export interface Headline {
  title: string;
  url: string;
  source?: string;
}

export interface KeyLevels {
  support?: number[];
  resistance?: number[];
}

export interface BriefingSection {
  /** Anchor for in-page linking, e.g. "0635-trt", "1900-trt" */
  anchor: string;
  slot: UpdateSlot;
  /** ISO timestamp UTC when this section was generated */
  timestamp_utc: string;
  /** Display-formatted local time, e.g. "2026-05-04 06:35 TRT" */
  timestamp_trt: string;
  past: string;
  why: string;
  watch: string;
  headlines?: Headline[];
}

export interface AssetBriefing {
  slug: string;
  ticker: string;
  display_name: string;
  category: AssetCategory;
  /** Latest price snapshot, applied across all sections of the day */
  price: number | null;
  price_display: string;
  change_pct: number | null;
  change_abs: number | null;
  change_display: string;
  key_levels?: KeyLevels;
  distance_52w_high_pct?: number | null;
  distance_52w_low_pct?: number | null;
  /** Chronological list of intra-day updates. One entry per Cowork run that wrote to this asset. */
  sections: BriefingSection[];
  /** True if PM run flagged a material change vs AM */
  material_change?: boolean;
}

export interface MacroContext {
  dxy?: number;
  us10y?: number;
  vix?: number;
  headline?: string;
}

export interface UpdateMetadata {
  slot: UpdateSlot;
  timestamp_utc: string;
  timestamp_trt: string;
  anchor: string;
}

export interface DayBriefing {
  /** ISO date string, e.g. "2026-05-04" */
  date: string;
  /** ISO timestamp when the first section was generated */
  generated_at: string;
  /** ISO timestamp of the most recent update */
  last_updated_at: string;
  market_status: 'open' | 'closed' | 'weekend';
  /** Chronological list of all update events for this day */
  updates: UpdateMetadata[];
  /** Map keyed by asset slug (eur-usd, gold, bitcoin, etc.) */
  assets: Record<string, AssetBriefing>;
  macro_context?: MacroContext;
}

export interface LatestPointer {
  latest_date: string;
  latest_run_at: string;
  latest_slot: UpdateSlot;
}
