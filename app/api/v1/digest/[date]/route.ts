// GET /api/v1/digest/[date] — full day briefing JSON for a specific date.

import { NextResponse } from 'next/server';
import { readBriefing, isValidDate } from '@/lib/briefings';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  const { date } = await params;

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

  return NextResponse.json(briefing);
}
