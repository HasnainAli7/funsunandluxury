import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import { Role } from '@/routers/types';

const validateRequestBody = (data: Role): string | null => {
    if (!data) return 'Request body is missing';
    if (!data.role_name) return 'Role name is required';
 
    return null;
}

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const data: Role = await req.json();

        const validationError = validateRequestBody(data);
        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 });
        }

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {
            const query = 'INSERT INTO roles (role_name) VALUES (?)';
            const values = [data.role_name];
            const [result] = await connection.execute(query, values);

            await connection.end();

            return NextResponse.json({ message: 'Role create successfully', RoleId: (result as any).insertId }, { status: 201 });
        } catch (error: any) {
             console.error('Error inserting role:', error);
            await connection.end();
            return NextResponse.json({ message: 'Error creating role', error: error.message }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Invalid request', error: error.message }, { status: 400 });
    }
}
