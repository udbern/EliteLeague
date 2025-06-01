import { NextResponse } from 'next/server';
import { updateStandingsForFixture } from '@/lib/updateStandings';

export async function POST(request) {
  const sanitySecret = request.headers.get('x-sanity-key');

  if (sanitySecret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body?.transition !== 'update') {
    return NextResponse.json({ ok: true });
  }

  const fixtureId = body.documentId;
  await updateStandingsForFixture(fixtureId);

  return NextResponse.json({ ok: true });
}
