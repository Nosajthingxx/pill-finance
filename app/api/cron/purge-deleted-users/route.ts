// Daily cron — hard-deletes users that soft-deleted more than 30 days ago.
// Configure in vercel.json:
//   { "crons": [{ "path": "/api/cron/purge-deleted-users", "schedule": "0 3 * * *" }] }
//
// Vercel signs cron requests with the CRON_SECRET env var. We verify it.

import { NextResponse } from 'next/server';
import {
  findExpiredSoftDeletedUsers,
  hardDeleteUser,
} from '@/lib/db/users';

export async function GET(request: Request) {
  // Vercel sends Authorization: Bearer ${CRON_SECRET}
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const expired = await findExpiredSoftDeletedUsers();
  const deleted: string[] = [];
  for (const u of expired) {
    await hardDeleteUser(u.id);
    deleted.push(u.email);
  }
  return NextResponse.json({ ok: true, deleted: deleted.length });
}
