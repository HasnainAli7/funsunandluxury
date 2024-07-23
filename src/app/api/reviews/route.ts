import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import { CustomerReview } from '@/routers/types';

export async function POST(req: NextRequest) {

    if (req.method !== 'POST') {

        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });

    }

    const data: CustomerReview = await req.json();

    const { pool_Id, listing_type, review, rating, createdBy, modifiedBy, status } = data;

    if (!pool_Id || !listing_type || !review || !rating) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const connection = await connect();

    if (!connection) {
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    try {

        const [result] = await connection.execute(`INSERT INTO customer_reviews 
            (pool_Id, listing_type, review, rating, review_date, createdBy, modifiedBy, createdOn, modifiedOn, status) 
            VALUES (?, ?, ?, ?, NOW(), ?, ?, NOW(), NOW(), ?)`,
            [pool_Id, listing_type, review, rating, createdBy, modifiedBy, status]
        );

        await connection.end();

        return NextResponse.json({ message: 'Review added successfully', result }, { status: 201 });

    } catch (error: any) {
        await connection.end();
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
