import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const project = await getProjectSession();
  if (!project) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const upstream = await fetch(
    `${getApiBaseUrl()}/documents/materials/${id}`,
    {
      headers: {
        Authorization: `Bearer ${project.projectToken}`,
      },
      cache: 'no-store',
    }
  );

  if (!upstream.ok) {
    return NextResponse.json(
      { error: 'Failed to load material' },
      { status: upstream.status }
    );
  }

  const contentType =
    upstream.headers.get('content-type') ?? 'application/json';
  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=60',
    },
  });
}
