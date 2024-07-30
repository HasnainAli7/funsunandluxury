import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import bcrypt from 'bcrypt';
import path from 'path';
import { writeFile } from 'fs/promises';
import fs from 'fs';


export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        // Parse FormData from the request
        const formData = await req.formData();
        
        // Extract form fields
        const RoleId = formData.get('Registration_Type')?.toString() || '';
        const firstName = formData.get('firstName')?.toString() || '';
        const lastName = formData.get('lastName')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';
        const confirmPassword = formData.get('confirmPassword')?.toString() || '';
        const description = formData.get('Description')?.toString() || '';
        const profileImage = formData.get('Profile');

        // Validate form data
        if (!firstName || !lastName || !email || !password || !confirmPassword||!RoleId||!description) {
            return NextResponse.json({ message: 'All required fields must be provided.' }, { status: 400 });
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ message: 'Passwords do not match.' }, { status: 400 });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Connect to the database
        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        let profileImagePath = '';
               
        if (!profileImage || !(profileImage instanceof File)) {
            return NextResponse.json({ error: 'No valid profile image file received.' }, { status: 400 });
        }

        const profileBuffer = Buffer.from(await profileImage.arrayBuffer());
        const profileFilename = profileImage.name.replaceAll(' ', '_');

        try {
            await writeFile(path.join(process.cwd(), 'public/assets/', profileFilename), profileBuffer);
            profileImagePath = "/assets/"+profileFilename;
        } catch (error) {

            return NextResponse.json({ error: 'Failed to save profile image file', status: 500 });
        }


        try {
            // Insert user into database
            const query = 'INSERT INTO users (first_name, last_name, email, password, description, Profile_ImagePath) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [firstName, lastName, email, hashedPassword, description, profileImagePath];
            
            const [result] = await connection.execute(query, values);
            const userId = (result as any).insertId;

            if (userId > 0) {
                // Insert into user_roles table
                await connection.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId,RoleId]);
            }

            return NextResponse.json({ message: 'User registered successfully', userId }, { status: 201 });
        } catch (error: any) {
            console.error('Database error:', error.message);
            return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
        } finally {
            await connection.end();
        }
    } catch (error: any) {
        console.error('Request error:', error.message);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
       
        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {
            const query = 'select * from roles where id<>1';
            const [rows] = await connection.execute(query);
            
            return NextResponse.json(rows, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch venue listings' }, { status: 500 });
        } finally {
            connection.end();
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request', status: 500 });
    }
}

