// GET /api/v1/asset/[slug] — latest briefing data for a single asset.

import { NextResponse } from 'next/server';
import { isValidSlug, getAsset } from '@/lib/slugs';
import { readLatestBriefing } from '@/lib/briefings';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: 'Unknown asset slug', slug },
      { status: 404 },
    );
  }

  const briefing = await readLatestBriefing();
  if (!briefing) {
    return NextResponse.json(
      { error: 'No briefing data available yet' },
      { status: 404 },
    );
  }

  const assetBriefing = briefing.assets[slug];
  if (!assetBriefing) {
    return NextResponse.json(
      { error: 'Asset not found in latest briefing', slug },
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
