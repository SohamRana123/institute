import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/student-login',
];

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Allow public paths without authentication
  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next();
  }

  // Get the token from the Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};