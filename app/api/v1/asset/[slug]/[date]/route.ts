// GET /api/v1/asset/[slug]/[date] -- historical briefing data for an asset on a specific date.

import { NextResponse } from 'next/server';
import { isValidSlug, getAsset } from '@/lib/slugs';
import { readBriefing, isValidDate } from '@/lib/briefings';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; date: string }> },
) {
  const { slug, date } = await params;

  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: 'Unknown asset slug', slug },
      { status: 404 },
    );
  }

  if (!isValidDate(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Expected YYYY-MM-DD.', date },
      { status: 400 },
    );
  }

  const briefing = await readBriefing(date);
  if (!briefing) {
    return NextResponse.json(
      { error: 'No briefing found for this date', date },
      { status: 404 },
    );
  }

  const assetBriefing = briefing.assets[slug];
  if (!assetBriefing) {
    return NextResponse.json(
      { error: 'Asset not found in briefing for this date', slug, date },
      { status: 404 },
    );
  }

  const meta = getAsset(slug)!;

  return NextResponse.json({
    date: briefing.date,
    generated_at: briefing.generated_at,
    last_updated_at: briefing.last_updated_at,
    market_status: briefing.market_status,
    asset: {
      ...assetBriefing,
      display_name: meta.displayName,
    },
  });
}
