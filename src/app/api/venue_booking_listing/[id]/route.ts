import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {
            const id = params.id;

            // Query the database for all booking dates
              const query = 'SELECT BookingDate FROM `bookinglisting` WHERE StoreListingID=? AND ListingType="Venue"';
            const [rows] = await connection.execute(query, [id]);

            // Extract dates from the rows and convert to a comma-separated string
            const bookingDates = (rows as { BookingDate: string }[]).map(row => row.BookingDate).join(',');

            return NextResponse.json({ bookingDates }, { status: 200 });
        } catch (error) {
            console.error('Error occurred while fetching pool listings:', error);
            return NextResponse.json({ error: 'Failed to fetch pool listings' }, { status: 500 });
        } finally {
            connection.end();
        }
    } catch (error) {
        console.error('Error occurred while processing request:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}


