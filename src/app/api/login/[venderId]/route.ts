import { connect } from "@/utils/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
 
    const { searchParams } = new URL(req.url);
   
    const venderId = searchParams.get('session_id');
  
    if (!venderId) {
  
      return NextResponse.json({ error: 'venderId ID is required' }, { status: 400 });
  
    }
  
    const connection = await connect();
  
    try {

  
      if (!connection) {
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
      }

  
      const [rows] = await connection.query('SELECT * FROM payments WHERE stripe_session_id = ?', [venderId]);


      const vender = rows as any[];
      
        return NextResponse.json({vender},{ status: 500 });
  
    
      await connection?.end();
  
    } catch (error: any) {
  
      await connection?.end();
  
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    finally {
      await connection?.end();
    }
  }
  