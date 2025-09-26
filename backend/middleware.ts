import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
      },
    });
  }

  const apiKey = req.headers.get('x-api-key');
  const validKey = process.env.API_KEY;

  // Exclude Clerk webhook route from API key check
  if (req.nextUrl.pathname.startsWith('/api')) {
    if (!apiKey || apiKey !== validKey) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // <-- Add this line
        },
      });
    }
  }

  return NextResponse.next();
}
