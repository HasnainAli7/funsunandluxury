import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import { Booking } from '@/routers/types';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const booking: Booking = await req.json();

        if (!booking.TotalAdults || !booking.TotalHours || !booking.ListingType || !booking.StoreListingID || !booking.TotalAmount || !booking.BookingDate || !booking.CreatedBookingUserID) {

            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {

            // Check for existing booking
            const [existingBooking] = await connection.execute(
                `SELECT * FROM bookinglisting 
                WHERE BookingDate = ? 
                AND StoreListingID = ? 
                AND ListingType = ?`,
                [
                    booking.BookingDate,
                    booking.StoreListingID,
                    booking.ListingType
                ]
            );

            if ((existingBooking as any[]).length > 0) {
                await connection.end();
                return NextResponse.json({ error: 'Booking already exists for this date and listing type' }, { status: 400 });
            }

            const query = 'INSERT INTO bookinglisting ( TotalAdults, TotalChildren, TotalInfants,TotalHours, ListingType, StoreListingID, TotalAmount, BookingDate, CreatedBookingUserID ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';

            const values = [booking.TotalAdults, booking.TotalChildren, booking.TotalInfants, booking.TotalHours, booking.ListingType, booking.StoreListingID, booking.TotalAmount, booking.BookingDate, booking.CreatedBookingUserID];


            const [result] = await connection.execute(query, values);



            await connection.end();

            return NextResponse.json({BookingId: (result as any).insertId}, { status: 201 });
        }
        catch (error: any) {
            await connection.end();
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        finally {

            await connection.end();
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
