// JSON export of all user data. Requires auth.
// User clicks the "Export my data" button on /account; the browser downloads pill-finance-export.json.

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { buildUserExport } from '@/app/account/actions';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const data = await buildUserExport(session.user.id);
  const filename = `pill-finance-export-${new Date().toISOString().slice(0, 10)}.json`;
  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
