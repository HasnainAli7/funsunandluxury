// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';
import path from 'path';
import { writeFile } from 'fs/promises';
import { PoolListing } from '@/routers/types';


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
        let poolFilePaths: string[] = [];

        // const coverImage = formData.get('pool_cover_image');
        // if (!coverImage || !(coverImage instanceof File)) {
        //     return NextResponse.json({ error: 'No valid cover image file received.' }, { status: 400 });
        // }

        // const coverBuffer = Buffer.from(await coverImage.arrayBuffer());
        // const coverFilename = coverImage.name.replaceAll(' ', '_');

        // try {
        //     await writeFile(path.join(process.cwd(), 'public/assets/', coverFilename), coverBuffer);
        //     coverFilePath = "/assets/"+coverFilename;
        // } catch (error) {
        //     return NextResponse.json({ error: 'Failed to save cover image file', status: 500 });
        // }

        // const poolImages = formData.getAll('pool_images');
        // for (const poolImage of poolImages) {
        //     if (!(poolImage instanceof File)) {
        //         return NextResponse.json({ error: 'Invalid file received in pool images.' }, { status: 400 });
        //     }

        //     const poolBuffer = Buffer.from(await poolImage.arrayBuffer());
        //     const poolFilename = poolImage.name.replaceAll(' ', '_');

        //     try {
        //         await writeFile(path.join(process.cwd(), 'public/assets/', poolFilename), poolBuffer);
        //         poolFilePaths.push("/assets/"+poolFilename);
        //     } catch (error) {
        //         return NextResponse.json({ error: 'Failed to save pool image file', status: 500 });
        //     }
        // }

        const poolData: Partial<PoolListing> = {
            pool_title: formData.get('pool_title')?.toString() || '',
            availability_date: formData.get('availability_date')?.toString() || '',
            blockout_dates: formData.get('blockout_dates')?.toString() || '',
            pool_address: formData.get('pool_address')?.toString() || '',
            city: formData.get('city')?.toString() || '',
            state: formData.get('state')?.toString() || '',
            zip_code: formData.get('zip_code')?.toString() || '',
            Country: formData.get('Country')?.toString() || '',
            latitude: formData.get('latitude')?.toString() || '',
            longitude: formData.get('longitude')?.toString() || '',
            phone_number: formData.get('phone_number')?.toString() || '',
            pool_width: Number(formData.get('pool_width')),
            pool_length: Number(formData.get('pool_length')),
            pool_depth: Number(formData.get('pool_depth')),
            vehicles_accommodate: formData.get('vehicles_accommodate')?.toString() || '',
            restrooms_residence: formData.get('restrooms_residence') === 'true',
            restrooms_portable: formData.get('restrooms_portable') === 'true',
            restrooms_private: formData.get('restrooms_private') === 'true',
            restrooms_offsite: formData.get('restrooms_offsite') === 'true',
            parking_lot: formData.get('parking_lot') === 'true',
            street_parking: formData.get('street_parking') === 'true',
            guest_rate_1_5: formData.get('guest_rate_1_5') ? Number(formData.get('guest_rate_1_5')) : null,
            guest_rate_6_10: formData.get('guest_rate_6_10') ? Number(formData.get('guest_rate_6_10')) : null,
            guest_rate_11_20: formData.get('guest_rate_11_20') ? Number(formData.get('guest_rate_11_20')) : null,
            guest_rate_21_30: formData.get('guest_rate_21_30') ? Number(formData.get('guest_rate_21_30')) : null,
            guest_rate_31_40: formData.get('guest_rate_31_40') ? Number(formData.get('guest_rate_31_40')) : null,
            guest_rate_41_50: formData.get('guest_rate_41_50') ? Number(formData.get('guest_rate_41_50')) : null,
            guest_rate_51_65: formData.get('guest_rate_51_65') ? Number(formData.get('guest_rate_51_65')) : null,
            guest_rate_66_80: formData.get('guest_rate_66_80') ? Number(formData.get('guest_rate_66_80')) : null,
            guest_rate_81_100: formData.get('guest_rate_81_100') ? Number(formData.get('guest_rate_81_100')) : null,
            pool_capacity: Number(formData.get('pool_capacity')),
            pets_allowed: Number(formData.get('pets_allowed')),
            entertainment_alcohol: formData.get('entertainment_alcohol') === 'true',
            entertainment_smoking: formData.get('entertainment_smoking') === 'true',
            entertainment_parties: formData.get('entertainment_parties') === 'true',
            amenities_speakers: formData.get('amenities_speakers') === 'true',
            amenities_grill: formData.get('amenities_grill') === 'true',
            amenities_brick_oven: formData.get('amenities_brick_oven') === 'true',
            amenities_playground: formData.get('amenities_playground') === 'true',
            amenities_tennis_court: formData.get('amenities_tennis_court') === 'true',
            amenities_volleyball_court: formData.get('amenities_volleyball_court') === 'true',
            amenities_basketball_court: formData.get('amenities_basketball_court') === 'true',
            amenities_sauna: formData.get('amenities_sauna') === 'true',
            amenities_wifi: formData.get('amenities_wifi') === 'true',
            amenities_table_chairs: formData.get('amenities_table_chairs') === 'true',
            description: formData.get('description')?.toString() || '',
            flexible_clause: formData.get('flexible_clause') === 'true',
            clause_30_day: formData.get('clause_30_day') === 'true',
            clause_24_hour: formData.get('clause_24_hour') === 'true',
            terms_conditions: formData.get('terms_conditions') === 'true',
            createdBy:Number(formData.get('createdBy')?.toString()) || 0
        };

        try {
            const query = `
                INSERT INTO poollisting (
                    pool_title, availability_date, blockout_dates, pool_address, city, state, zip_code,Country,latitude,longitude, phone_number,
                    pool_width, pool_length, pool_depth, vehicles_accommodate, restrooms_residence, restrooms_portable,
                    restrooms_private, restrooms_offsite, parking_lot, street_parking, guest_rate_1_5, guest_rate_6_10,
                    guest_rate_11_20, guest_rate_21_30, guest_rate_31_40, guest_rate_41_50, guest_rate_51_65, guest_rate_66_80,
                    guest_rate_81_100, pool_capacity, pets_allowed, entertainment_alcohol, entertainment_smoking,
                    entertainment_parties, amenities_speakers, amenities_grill, amenities_brick_oven, amenities_playground,
                    amenities_tennis_court, amenities_volleyball_court, amenities_basketball_court, amenities_sauna, amenities_wifi,
                    amenities_table_chairs, description, flexible_clause, clause_30_day, clause_24_hour, terms_conditions,
                    pool_images, pool_cover_image, created_by, created_on, modified_by, modified_on
                ) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                poolData.pool_title,
                poolData.availability_date,
                poolData.blockout_dates || null,
                poolData.pool_address,
                poolData.city,
                poolData.state,
                poolData.zip_code,
                poolData.Country,
                poolData.latitude,
                poolData.longitude,
                poolData.phone_number || null,
                poolData.pool_width || null,
                poolData.pool_length || null,
                poolData.pool_depth || null,
                poolData.vehicles_accommodate || null,
                poolData.restrooms_residence || false,
                poolData.restrooms_portable || false,
                poolData.restrooms_private || false,
                poolData.restrooms_offsite || false,
                poolData.parking_lot || false,
                poolData.street_parking || false,
                poolData.guest_rate_1_5 || null,
                poolData.guest_rate_6_10 || null,
                poolData.guest_rate_11_20 || null,
                poolData.guest_rate_21_30 || null,
                poolData.guest_rate_31_40 || null,
                poolData.guest_rate_41_50 || null,
                poolData.guest_rate_51_65 || null,
                poolData.guest_rate_66_80 || null,
                poolData.guest_rate_81_100 || null,
                poolData.pool_capacity || 0,
                poolData.pets_allowed || 0,
                poolData.entertainment_alcohol || false,
                poolData.entertainment_smoking || false,
                poolData.entertainment_parties || false,
                poolData.amenities_speakers || false,
                poolData.amenities_grill || false,
                poolData.amenities_brick_oven || false,
                poolData.amenities_playground || false,
                poolData.amenities_tennis_court || false,
                poolData.amenities_volleyball_court || false,
                poolData.amenities_basketball_court || false,
                poolData.amenities_sauna || false,
                poolData.amenities_wifi || false,
                poolData.amenities_table_chairs || false,
                poolData.description || null,
                poolData.flexible_clause || false,
                poolData.clause_30_day || false,
                poolData.clause_24_hour || false,
                poolData.terms_conditions || false,
                poolFilePaths.toString(),
                coverFilePath.toString(),
                poolData.createdBy, // created_by
                new Date().toISOString().slice(0, 19).replace('T', ' '), // created_on
                "0", // modified_by
                new Date().toISOString().slice(0, 19).replace('T', ' ') // modified_on
            ];

            const [result] = await connection.execute(query, values);
            return NextResponse.json({ message: 'Pool listing added successfully', result }, { status: 201 });
        } catch (error) {
            console.error('Error occurred while inserting pool data:', error);
            return NextResponse.json({ error: 'Failed to add pool listing' }, { status: 500 });
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
            // Query the database for all pool listings
            const query = 'SELECT * FROM poollisting';
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

export async function PUT(req: NextRequest) {
   
    if (req.method !== 'PUT') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
    
        const { PoolId, Status,ModifiedBy } = await req.json();

        if (!PoolId || !Status || !ModifiedBy) {

            return NextResponse.json({ error: 'PoolId and Status are required' }, { status: 400 });
        }

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
        }

        try {

            const [result] = await connection.execute('UPDATE poollisting SET Status = ?, modified_by=? WHERE id = ?',[Status,ModifiedBy,PoolId]);
        
            await connection.end();

            if ((result as any).affectedRows === 0) {
                
                return NextResponse.json({ error: 'Pool not found' }, { status: 404 });
              
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

