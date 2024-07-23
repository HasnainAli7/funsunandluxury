import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, decodeJwt } from 'jose';
import { JwtPayload } from '@/routers/types';

const secret = new TextEncoder().encode("3f173bae5d335b7a7f1e3bb8d3cddb1f69dc1b56ba44dd22e44a149e0da1b0bd1da282105fd333818a88a5cc6e9c7d53782c076ee2394b8211fc55a77b3cf8bd");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the request is for the login or register page
  if (pathname === '/login' || pathname === '/register') {
    const token = req.cookies.get('token')?.value;

    if (token) {
      try {
        // Decode the token without verifying to avoid the use of Node.js crypto module
        const decodedToken = decodeJwt(token) as JwtPayload;

        // Check if the token is expired
        if (decodedToken.exp * 1000 >= Date.now()) {
          // Redirect authenticated users away from login/register pages
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes = ['/Dashboard', '/add-venue-listing', '/add-pool-listing'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      // Redirect unauthenticated users to the login page
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      // Verify the token and extract user data
      const { payload  } = await jwtVerify(token, secret, { algorithms: ['HS256'] })

      // Check if the token is expired
      if (!payload.exp || payload.exp * 1000 < Date.now()) {
        
        // If token is expired, redirect to login page
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Attach the decoded user data to the request object
      (req as any).user = payload

      return NextResponse.next();
    } catch (err) {
      console.error('Token verification failed:', err);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // For all other routes, just continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/Dashboard/:path*', '/add-venue-listing/:path*','/add-pool-listing/:path*'],
};
