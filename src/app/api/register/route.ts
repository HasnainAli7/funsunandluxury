import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import { Register } from '@/routers/types';
import bcrypt from 'bcrypt';

const validateRequestBody = (data: Register): string | null => {
    if (!data) return 'Request body is missing';
    if (!data.firstName) return 'First name is required';
    if (!data.lastName) return 'Last name is required';
    if (!data.email) return 'Email is required';
    if (!data.password) return 'Password is required';
    if (!data.confirmPassword) return 'Confirm Password is required';
 
    return null;
}

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const data: Register = await req.json();

        const validationError = validateRequestBody(data);
        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 });
        }

        // Hash the password
       const hashedPassword = await bcrypt.hash(data.password, 10);

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {
            const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
            const values = [data.firstName, data.lastName, data.email, hashedPassword];
            const [result] = await connection.execute(query, values);
            
            const UserId= (result as any).insertId;

             if(UserId > 0)
                
             {

                await connection.execute('INSERT INTO user_roles (user_id , role_id ) VALUES (?, ?)', [UserId,2]);

             }


            await connection.end();

            return NextResponse.json({ message: 'User registered successfully', userId: (result as any).insertId }, { status: 201 });
        } catch (error: any) {
            await connection.end();
            return NextResponse.json({error: error.message }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({error: error.message }, { status: 400 });
    }
}
