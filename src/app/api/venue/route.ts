// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import path from 'path';
import { writeFile } from 'fs/promises';
import { VenueSpace } from '@/routers/types';

export async function POST(req: NextRequest) {

    try {

        if (req.method !== 'POST') {
            return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
        }

        const connection = await connect();

        if (!connection) {
            
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        const formData = await req.formData();

        let coverFilePath = '';
        let vanueFilePath: string[] = [];

        const coverimage = formData.get('Venue_cover_image');

        if (!coverimage || !(coverimage instanceof File)) {
            return NextResponse.json({ error: 'No valid cover image file received.' }, { status: 400 });
        }

        const coverBuffer = Buffer.from(await coverimage.arrayBuffer());
        const coverFilename = coverimage.name.replaceAll(' ', '_');

        try {
            await writeFile(path.join(process.cwd(), 'public/assets/', coverFilename), coverBuffer);
            coverFilePath = "/assets/"+coverFilename;
        } catch (error) {

            return NextResponse.json({ error: 'Failed to save cover image file', status: 500 });
        }

        const venueimages = formData.getAll('venueimage');

        for (const venueimage of venueimages) {

            if (!(venueimage instanceof File)) {
                return NextResponse.json({ error: 'Invalid file received in venue images.' }, { status: 400 });
            }


            const venueBuffer = Buffer.from(await venueimage.arrayBuffer());
            const venueFilename = venueimage.name.replaceAll(' ', '_');

            try {
                await writeFile(path.join(process.cwd(), 'public/assets/', venueFilename), venueBuffer);
                vanueFilePath.push("/assets/"+venueFilename);
            } catch (error) {
                return NextResponse.json({ error: 'Failed to save venue image file', status: 500 });
            }
        }

        const venueData: Partial<VenueSpace> = {
            title: formData.get('title')?.toString() || '',
            availability_date: formData.get('availability_date')?.toString() || '',
            block_out_dates: formData.get('block_out_dates')?.toString() || '',
            space_address: formData.get('space_address')?.toString() || '',
            city: formData.get('city')?.toString() || '',
            state: formData.get('state')?.toString() || '',
            zip_code: formData.get('zip_code')?.toString() || '',
            Country: formData.get('Country')?.toString() || '',
            latitude: formData.get('latitude')?.toString() || '',
            longitude: formData.get('longitude')?.toString() || '',
            phone_number: formData.get('phone_number')?.toString() || '',
            venue_type: formData.get('venue_type')?.toString() || '',
            onsite_parking_free: formData.get('onsite_parking_free') === 'true',
            onsite_parking_paid: formData.get('onsite_parking_paid') === 'true',
            street_parking: formData.get('street_parking') === 'true',
            valet_service: formData.get('valet_service') === 'true',
            no_parking: formData.get('no_parking') === 'true',
            vehicle_accommodation: Number(formData.get('vehicle_accommodation')),
            speakers: formData.get('speakers') === 'true',
            grill: formData.get('grill') === 'true',
            brick_oven: formData.get('brick_oven') === 'true',
            playground: formData.get('playground') === 'true',
            tennis_court: formData.get('tennis_court') === 'true',
            volleyball_court: formData.get('volleyball_court') === 'true',
            basketball_court: formData.get('basketball_court') === 'true',
            sauna: formData.get('sauna') === 'true',
            wifi: formData.get('wifi') === 'true',
            table_chairs: formData.get('table_chairs') === 'true',
            additional_amenities: formData.get('additional_amenities')?.toString() || '',
            number_of_rooms: Number(formData.get('number_of_rooms')),
            square_footage: Number(formData.get('square_footage')),
            hosting_hours: Number(formData.get('hosting_hours')),
            surveillance_systems: formData.get('surveillance_systems') === 'true',
            hourly_rate: Number(formData.get('hourly_rate')),
            flat_rate: Number(formData.get('flat_rate')),
            minimum_hours: Number(formData.get('minimum_hours')),
            guest_capacity: Number(formData.get('guest_capacity')),
            description: formData.get('description')?.toString() || '',
            flexible_clause: formData.get('flexible_clause') === 'true',
            thirty_day_clause: formData.get('thirty_day_clause') === 'true',
            twenty_four_hour_clause: formData.get('twenty_four_hour_clause') === 'true',
            terms_agreement: formData.get('terms_agreement') === 'true',
            createdBy:Number(formData.get('createdBy')?.toString()) || 0
        };

        try {

            const query = `
                    INSERT INTO venue_spaces (
                        title, availability_date, block_out_dates, space_address, city, state, zip_code,Country,latitude,longitude,
                        phone_number, venue_type, onsite_parking_free, onsite_parking_paid, street_parking,
                        valet_service, no_parking, vehicle_accommodation, speakers, grill, brick_oven, playground,
                        tennis_court, volleyball_court, basketball_court, sauna, wifi, table_chairs,
                        additional_amenities, number_of_rooms, square_footage, hosting_hours,
                        surveillance_systems, hourly_rate, flat_rate, minimum_hours, guest_capacity,
                        venueimage_base64, venue_cover_image_base64, description, flexible_clause, thirty_day_clause,
                        twenty_four_hour_clause, terms_agreement,CreatedBy
                    ) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
                `;

            const values = [
                venueData.title,
                venueData.availability_date,
                venueData.block_out_dates || null,
                venueData.space_address,
                venueData.city,
                venueData.state,
                venueData.zip_code,
                venueData.Country,
                venueData.latitude,
                venueData.longitude,
                venueData.phone_number,
                venueData.venue_type,
                venueData.onsite_parking_free || false,
                venueData.onsite_parking_paid || false,
                venueData.street_parking || false,
                venueData.valet_service || false,
                venueData.no_parking || false,
                venueData.vehicle_accommodation || null,
                venueData.speakers || false,
                venueData.grill || false,
                venueData.brick_oven || false,
                venueData.playground || false,
                venueData.tennis_court || false,
                venueData.volleyball_court || false,
                venueData.basketball_court || false,
                venueData.sauna || false,
                venueData.wifi || false,
                venueData.table_chairs || false,
                venueData.additional_amenities || null,
                venueData.number_of_rooms,
                venueData.square_footage,
                venueData.hosting_hours,
                venueData.surveillance_systems || false,
                venueData.hourly_rate,
                venueData.flat_rate,
                venueData.minimum_hours,
                venueData.guest_capacity,
                vanueFilePath.toString(),
                coverFilePath.toString(),
                venueData.description || null,
                venueData.flexible_clause || false,
                venueData.thirty_day_clause || false,
                venueData.twenty_four_hour_clause || false,
                venueData.terms_agreement || false,
                venueData.createdBy, // created_by
            ];

            const [result] = await connection.execute(query, values);
            return NextResponse.json({ message: 'Venue space added successfully', result }, { status: 201 });
        } catch (error) {
            console.error('Error occurred while inserting venue data:', error);
            return NextResponse.json({ error: 'Failed to add venue space' }, { status: 500 });
        } finally {
            connection.end();
        }
    } catch (error) {
        console.error('Error occurred while processing request:', error);
        return NextResponse.json({ error: 'Failed to process request', status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
       
        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {

            const query = 'SELECT * FROM venue_spaces';
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

export async function PUT(req: NextRequest) {
   
    if (req.method !== 'PUT') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
    
        const { VenueId, Status,ModifiedBy } = await req.json();

        if (!VenueId || !Status || !ModifiedBy) {

            return NextResponse.json({ error: 'VenueId and Status are required' }, { status: 400 });
        }

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {

            const [result] = await connection.execute('UPDATE venue_spaces SET Status = ?,	ModifiedBy=? WHERE id = ?',[Status,ModifiedBy, VenueId]);
        
            await connection.end();

            if ((result as any).affectedRows === 0) {
                
                return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
              
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
