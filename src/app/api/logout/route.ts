import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    req.headers.set('Access-Control-Allow-Credentials', true as any);
    req.headers.set('Access-Control-Allow-Origin', '*'); // Change '*' to your domain for security
    req.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    req.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    const res = new NextResponse('User Logout', { status: 200 });
    res.cookies.set('token', '', {
      maxAge: 0,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',  // Set to 'strict'
    });

    return res;
  } catch (error) {
    console.error('Error in POST request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
