// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../utils/lib/db';


export async function GET(req: NextRequest) {
    try {
      
        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {
         
            const [rows] = await connection.execute(`
                    SELECT id, Country
                    FROM (
                        SELECT id, Country, ROW_NUMBER() OVER (PARTITION BY Country ORDER BY id) AS rn
                        FROM (
                            SELECT id, Country FROM poollisting
                            UNION ALL
                            SELECT id, Country FROM venue_spaces
                        ) AS combined_list
                    ) AS numbered_list
                    WHERE rn = 1
                    LIMIT 5;`);

            return NextResponse.json(rows, { status: 200 });
        } catch (error) {
            console.error('Error occurred while fetching listings:', error);
            return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
        } finally {
            connection.end();
        }
    } catch (error) {
        console.error('Error occurred while processing request:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
