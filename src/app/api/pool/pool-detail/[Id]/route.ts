// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/utils/lib/db';

interface QueryResult { }

export async function GET(req: NextRequest, { params }: { params: { Id: string } }) {
    try {

        const { Id } = params;

        if (!Id) {

            return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
        }


        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {
       

            const query = `
              SELECT 
                    pl.*, 
                    AVG(cr.rating) AS average_rating, 
                    COUNT(cr.id) AS review_count 
                FROM 
                    poollisting pl 
                LEFT JOIN 
                    customer_reviews cr 
                ON 
                    pl.id = cr.pool_Id 
                WHERE 
                    pl.id = ? 
                GROUP BY 
                    pl.id;`;

            const [rows]: [any[], any] = await connection.query(query, [Id]);;

            const usersReviewsQuery = `
                SELECT 
                    U.id AS userId, 
                    CONCAT(U.first_name, ' ', U.last_name) AS fullName, 
                    CR.* 
                FROM 
                    customer_reviews AS CR 
                INNER JOIN 
                    users AS U 
                ON 
                    CR.CreatedBy = U.id 
                WHERE 
                    CR.pool_Id = ?`;

            const [usersReviewsData]: [any[], any] = await connection.query(usersReviewsQuery, [Id]);


            const HostInfo = `SELECT CONCAT(U.first_name, ' ', U.last_name) AS fullName,U.Profile_ImagePath,U.Description , U.email , U.created_at as Join_Date FROM users as U WHERE U.id =?`;

            const [HostInfoData]: [any[], any] = await connection.query(HostInfo, [rows[0]?.created_by]);

            return NextResponse.json({ "PoolDetails": rows, "Reviews": usersReviewsData, "HostInfo": HostInfoData }, { status: 200 });


        } catch (error) {

            return NextResponse.json({ error: 'Failed to fetch pool listings' }, { status: 500 });
        } finally {
            connection.end();
        }
    } catch (error) {

        return NextResponse.json({ error: 'Failed to process request', status: 500 });
    }
}
