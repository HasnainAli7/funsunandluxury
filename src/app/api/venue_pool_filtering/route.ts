// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '../../../utils/lib/db';

function constructWhereClause(filters: any, listingType: string) {
    const whereClauses: string[] = [];

    const poolAmenities = [
        'street_parking',
        'restrooms_residence',
        'restrooms_portable',
        'restrooms_private',
        'restrooms_offsite',
        'entertainment_alcohol',
        'entertainment_smoking',
        'entertainment_parties',
        'parking_lot',
        'amenities_speakers',
        'amenities_grill',
        'amenities_brick_oven',
        'amenities_playground',
        'amenities_tennis_court',
        'amenities_volleyball_court',
        'amenities_basketball_court',
        'amenities_sauna',
        'amenities_wifi',
        'amenities_table_chairs'
    ];

    const venueAmenities = [
        'onsite_parking_free',
        'onsite_parking_paid',
        'street_parking',
        'valet_service',
        'no_parking',
        'speakers',
        'grill',
        'brick_oven',
        'playground',
        'tennis_court',
        'volleyball_court',
        'basketball_court',
        'sauna',
        'wifi',
        'table_chairs'
    ];

    if (listingType === 'POOL LISTING' && (filters.Pool !== undefined && filters.Pool !== false)) {
        whereClauses.push("ListingType='POOL LISTING'");
        poolAmenities.forEach(amenity => {
            if (filters[amenity] !== undefined && filters[amenity] !== false) {
                whereClauses.push(`${amenity} = ${filters[amenity]}`);
            }
        });
    }

    if (listingType === 'VENUE LISTING' && (filters.Venue !== undefined && filters.Venue !== false)) {
        whereClauses.push("ListingType='VENUE LISTING'");
        venueAmenities.forEach(amenity => {
            if (filters[amenity] !== undefined && filters[amenity] !== false) {
                whereClauses.push(`${amenity} = ${filters[amenity]}`);
            }
        });
    }

    if (filters.Country !== undefined && filters.Country !== "") {
        whereClauses.push(`Country='${filters.Country}'`);
    }

    if (filters.rangePrices !== undefined && filters.rangePrices.length > 0) {
        const priceRange = `${filters.rangePrices[0]} AND ${filters.rangePrices[1]}`;
        if (listingType === 'POOL LISTING') {
            whereClauses.push(`guest_rate_1_5 BETWEEN ${priceRange}`);
        } else if (listingType === 'VENUE LISTING') {
            whereClauses.push(`hourly_rate BETWEEN ${priceRange}`);
        }
    }

    return whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
}

export async function POST(req: NextRequest) {
    try {
        const filters = await req.json().catch(() => ({}));

        const wherePoolClause = constructWhereClause(filters, 'POOL LISTING');
        const whereVenueClause = constructWhereClause(filters, 'VENUE LISTING');

        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {
            let query = '';

            // If no filters are applied, show all listings
            if (!wherePoolClause && !whereVenueClause) {
                query = `
                    SELECT id, pool_title as Title, guest_rate_1_5 as Price, pool_images as Images, city, state as location, latitude, longitude, 'POOL LISTING' as ListingType 
                    FROM poollisting
                    UNION ALL
                    SELECT id, title as Title, hourly_rate as Price, venueimage_base64 as Images, city, state as location, latitude, longitude, 'VENUE LISTING' as ListingType 
                    FROM venue_spaces
                `;
            } else {
                if (wherePoolClause) {
                    query += `
                        SELECT id, pool_title as Title, guest_rate_1_5 as Price, pool_images as Images, city, state as location, latitude, longitude, 'POOL LISTING' as ListingType 
                        FROM poollisting ${wherePoolClause}
                    `;
                }

                if (whereVenueClause) {
                    if (query) query += ' UNION ALL ';
                    query += `
                        SELECT id, title as Title, hourly_rate as Price, venueimage_base64 as Images, city, state as location, latitude, longitude, 'VENUE LISTING' as ListingType 
                        FROM venue_spaces ${whereVenueClause}
                    `;
                }
            }

            const [rows] = await connection.execute(query);

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
