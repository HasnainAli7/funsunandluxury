import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import { RolePermission } from '@/routers/types';

const validateRequestBody = (data: RolePermission): string | null => {
    if (!data) return 'Request body is missing';
    if (!data.role_id) return 'Role Id is required';
    if (!data.permission_id) return 'Permission Id is required';
 
    return null;
}

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const data: RolePermission = await req.json();

        const validationError = validateRequestBody(data);
        if (validationError) {
            return NextResponse.json({ message: validationError }, { status: 400 });
        }

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {
            const query = 'INSERT INTO role_permissions (role_id,permission_id) VALUES (?,?)';
            const values = [data.role_id,data.permission_id];
            await connection.execute(query, values);

            await connection.end();

            return NextResponse.json({ message: 'Role Permission create successfully'},{ status: 201 });
        } catch (error: any) {
             console.error('Error inserting Role Permission:', error);
            await connection.end();
            return NextResponse.json({ message: 'Error creating Role Permission', error: error.message }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: 'Invalid request', error: error.message }, { status: 400 });
    }
}
