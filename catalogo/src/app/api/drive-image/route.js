import { NextResponse } from 'next/server';
import { buildDriveSourceUrl } from '@/lib/googleDrive';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id')?.trim();

  if (!id) {
    return NextResponse.json({ error: 'Missing Drive image id' }, { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(buildDriveSourceUrl(id), {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      return NextResponse.json(
        { error: 'Failed to fetch Drive image' },
        { status: upstreamResponse.status || 502 }
      );
    }

    const contentType =
      upstreamResponse.headers.get('content-type') || 'application/octet-stream';
    const contentLength = upstreamResponse.headers.get('content-length');

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new Response(upstreamResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Drive image proxy failed:', error);
    return NextResponse.json(
      { error: 'Failed to proxy Drive image' },
      { status: 500 }
    );
  }
}
