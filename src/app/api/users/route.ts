import { connect } from "@/utils/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    try {
       
        const connection = await connect();
        if (!connection) {
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        try {
           
            const query = "SELECT U.id ,CONCAT(U.first_name, ' ', U.last_name) AS fullName,U.Profile_ImagePath FROM users as U;";
            
            const [rows] = await connection.execute(query);
            
            return NextResponse.json(rows, { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
        } finally {
            connection.end();
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request', status: 500 });
    }
}