import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const validKey = process.env.API_KEY;

  if (req.nextUrl.pathname.startsWith('/api')) {
    if (!apiKey || apiKey !== validKey) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return NextResponse.next();
}
