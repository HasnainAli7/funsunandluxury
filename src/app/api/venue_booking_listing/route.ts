import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import { Booking } from '@/routers/types';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        const booking: Booking = await req.json();

        if (!booking.TotalAdults || !booking.TotalHours || !booking.TotalChildren || !booking.TotalInfants || !booking.ListingType || !booking.StoreListingID || !booking.TotalAmount || !booking.BookingDate || !booking.CreatedBookingUserID) {

            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {

            // Check if TotalGuest exceeds the guest_capacity requirement for the venue
           
            const [guestCapacity] = await connection.execute(
                `SELECT guest_capacity FROM venue_spaces WHERE guest_capacity >= ? AND id = ?`,
                [booking.TotalGuest, booking.StoreListingID]
            );

            if ((guestCapacity as any[]).length === 0) {
                await connection.end();
                return NextResponse.json({ error: 'Total guests exceed the venue\'s guest capacity' }, { status: 400 });
            }

            // Check if TotalHours exceeds the minimum_hours requirement for the venue
            const [existingHours] = await connection.execute(
                `SELECT * FROM venue_spaces WHERE minimum_hours <= ? AND id = ?`,
                [booking.TotalHours, booking.StoreListingID]
            );

            if ((existingHours as any[]).length === 0) {
                await connection.end();
                return NextResponse.json({ error: 'Total hours exceed the minimum hours requirement for this venue' }, { status: 400 });
            }


            // Check for existing booking
            const [existingBooking] = await connection.execute(
                `SELECT * FROM BookingListing 
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

            const query = 'INSERT INTO BookingListing ( TotalAdults, TotalChildren, TotalInfants,TotalHours, ListingType, StoreListingID, TotalAmount, BookingDate, CreatedBookingUserID ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)';

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


export async function GET(req: NextRequest) {
    try {
       
        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {
            // Query the database for all pool listings
            const query = 'SELECT B.BookingId, B.TotalAdults, B.TotalChildren, B.TotalInfants, B.TotalGuest, COALESCE(P.pool_title, V.title) AS Title, B.ListingType,B.Status,B.BookingDate FROM `bookinglisting` AS B LEFT JOIN poollisting AS P ON B.StoreListingID = P.id LEFT JOIN venue_spaces AS V ON V.id = B.StoreListingID';
            const [rows] = await connection.execute(query);

            // Return the result
            return NextResponse.json(rows, { status: 200 });
        } catch (error) {
            console.error('Error occurred while fetching pool listings:', error);
            return NextResponse.json({ error: 'Failed to fetch pool listings' }, { status: 500 });
        } finally {
            connection.end();
        }
    } catch (error) {
        console.error('Error occurred while processing request:', error);
        return NextResponse.json({ error: 'Failed to process request', status: 500 });
    }
}


// For Dashboard Booking Venue Status Update

export async function PUT(req: NextRequest) {
   
    if (req.method !== 'PUT') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
    
        const { BookingId, Status,ModifiedBy } = await req.json();

        if (!BookingId || !Status) {

            return NextResponse.json({ error: 'BookingId and Status are required' }, { status: 400 });
        }

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {

            const [result] = await connection.execute('UPDATE bookinglisting SET Status = ?,ModifiedBy=? WHERE BookingId = ?',[Status,ModifiedBy,BookingId]);
        
            await connection.end();

            if ((result as any).affectedRows === 0) {
                
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
              
             }

            return NextResponse.json({ message: 'Status updated successfully'}, { status: 201 });
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


