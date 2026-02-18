// app/api/feed/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { fetchAllFeeds } = await import('@/lib/feeds');
    const data = await fetchAllFeeds();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ items: [], count: 0, error: e.message });
  }
}
