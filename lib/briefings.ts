// Typed JSON readers for per-day briefing files.
// Used by every Server Component that needs briefing data -- homepage,
// asset hubs, day archives, digests, sitemaps, RSS feeds, API routes.
//
// All reads happen at build time (SSG) or in API route handlers. Never on the client.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import type { DayBriefing, LatestPointer } from './types';

/** Absolute path to the data/briefings/ directory at build time. */
const DATA_DIR = path.join(process.cwd(), 'data', 'briefings');

/** Match YYYY-MM-DD strictly, with sane month/day ranges. */
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function isValidDate(date: string): boolean {
  return DATE_PATTERN.test(date);
}

/** Read latest.json. Cached per request to avoid re-reading the file repeatedly. */
export const readLatestPointer = cache(async (): Promise<LatestPointer | null> => {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, 'latest.json'), 'utf-8');
    return JSON.parse(raw) as LatestPointer;
  } catch (err) {
    // First run before any briefings exist -- fail soft.
    return null;
  }
});

/** Read a specific day's briefing file. Returns null if not found. */
export const readBriefing = cache(async (date: string): Promise<DayBriefing | null> => {
  if (!isValidDate(date)) return null;
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${date}.json`), 'utf-8');
    return JSON.parse(raw) as DayBriefing;
  } catch {
    return null;
  }
});

/** Read the latest briefing -- combines pointer + per-day file. */
export async function readLatestBriefing(): Promise<DayBriefing | null> {
  const ptr = await readLatestPointer();
  if (!ptr) return null;
  return readBriefing(ptr.latest_date);
}

/** List every date for which a per-day file exists. Sorted descending (newest first). */
export const listAvailableDates = cache(async (): Promise<string[]> => {
  try {
    const entries = await fs.readdir(DATA_DIR);
    return entries
      .filter(f => f.endsWith('.json') && f !== 'latest.json')
      .map(f => f.replace(/\.json$/, ''))
      .filter(isValidDate)
      .sort((a, b) => (a < b ? 1 : -1));
  } catch {
    return [];
  }
});

/**
 * List archive dates for a specific asset, optionally limited.
 * For Phase 1, every per-day file contains all 19 assets, so dates are equivalent
 * across assets. This indirection keeps the API ready for future per-asset granularity.
 */
export async function listArchivesFor(
  slug: string,
  options: { limit?: number } = {}
): Promise<string[]> {
  const all = await listAvailableDates();
  const filtered: string[] = [];
  for (const date of all) {
    const briefing = await readBriefing(date);
    if (briefing && briefing.assets[slug]) {
      filtered.push(date);
      if (options.limit && filtered.length >= options.limit) break;
    }
  }
  return filtered;
}

/** Used by sitemap generation. Returns the most recent update timestamp for a date. */
export async function getLastModified(date: string): Promise<Date | null> {
  const b = await readBriefing(date);
  if (!b) return null;
  return new Date(b.last_updated_at);
}

/** Build-time helper: years that have at least one archived day. */
export async function listArchiveYears(): Promise<string[]> {
  const dates = await listAvailableDates();
  const years = new Set(dates.map(d => d.slice(0, 4)));
  return Array.from(years).sort().reverse();
}

/** Build-time helper: year-months (e.g. "2026-05") with at least one archived day. */
export async function listArchiveMonths(): Promise<string[]> {
  const dates = await listAvailableDates();
  const months = new Set(dates.map(d => d.slice(0, 7)));
  return Array.from(months).sort().reverse();
}
