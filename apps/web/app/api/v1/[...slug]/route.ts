import { NextRequest, NextResponse } from 'next/server';

const EDGE_BASE =
  process.env.NEXT_PUBLIC_GATEWISE_EDGE_URL ||
  `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzhlfdhiawiujjkyczsi.supabase.co'}/functions/v1/gatewise-api`;

async function forwardToEdge(
  req: NextRequest,
  context: { params: { slug?: string[] } },
): Promise<NextResponse> {
  const segments = context.params.slug ?? [];
  let subPath = `/${segments.join('/')}`;

  // Backward-compatible path aliases for existing clients
  if (subPath === '/guard-permissions') {
    subPath = req.method === 'GET' ? '/guards' : '/guards';
  }

  const targetUrl = new URL(`${EDGE_BASE}${subPath}`);
  req.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const headers = new Headers();
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);
  const gwToken = req.headers.get('x-gatewise-token');
  if (gwToken) headers.set('x-gatewise-token', gwToken);
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  let body: ArrayBuffer | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.arrayBuffer();
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
    });

    const text = await upstream.text();
    const resHeaders = new Headers();
    const upstreamType = upstream.headers.get('content-type') || 'application/json';
    resHeaders.set('content-type', upstreamType);

    return new NextResponse(text, {
      status: upstream.status,
      headers: resHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Central gateway unreachable: ${err.message}`
            : 'Central gateway unreachable',
      },
      { status: 502 },
    );
  }
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, ctx: { params: { slug?: string[] } }) {
  return forwardToEdge(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: { slug?: string[] } }) {
  return forwardToEdge(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: { params: { slug?: string[] } }) {
  return forwardToEdge(req, ctx);
}

export async function PUT(req: NextRequest, ctx: { params: { slug?: string[] } }) {
  return forwardToEdge(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: { params: { slug?: string[] } }) {
  return forwardToEdge(req, ctx);
}
