import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { connect } from '@/utils/lib/db';
import { JwtPayload, User } from '@/routers/types';

const secret = process.env.JWT_SECRET as string;

// Define the structure of the request body
interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const { email, password }: LoginRequestBody = await req.json();

    const connection = await connect();

    if (!connection) {
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    try {
      // Fetch the user from the database
      const [rows] = await connection.query(`
        SELECT u.id, u.first_name, u.last_name, u.email, u.password, 
               GROUP_CONCAT(r.role_name) AS roles, 
               GROUP_CONCAT(p.permission_name) AS permissions
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        LEFT JOIN role_permissions rp ON r.id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.id
        WHERE u.email = ?
        GROUP BY u.id
      `, [email]);

      if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0] as any;

        // Check if the password is correct
        if (await bcrypt.compare(password, user.password)) {
          // Create user payload
          const userPayload: Partial<JwtPayload> = {
            id: user.id,
            email: user.email,
            name: user.first_name + ' ' + user.last_name,
            roles: user.roles ? user.roles.split(',') : [],
            permissions: user.permissions ? user.permissions.split(',') : [],
          };

          // Generate the JWT token
          const token = jwt.sign(userPayload, secret, { expiresIn: '2d' });

          // Set the cookie
          const res = NextResponse.json({ token });
          res.cookies.set('token', token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 2,  // 2 days in seconds
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',  // Set to 'strict'
          });

          return res;
        } else {
          return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
      } else {
        return NextResponse.json({ message: 'User not found' }, { status: 401 });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
      await connection.end();
    }
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}