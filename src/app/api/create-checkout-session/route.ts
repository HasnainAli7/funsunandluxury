import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe("sk_test_51N9968DXoT0g7l2j6kiRQalrTG4PhZJufAyagbI4l7okVXnI49ygnpMmhZNQ9E0MDfDIEozBeMNUImQN2tT1NpeK002V7SHymk");

export async function POST(req: NextRequest) {
 
  if (req.method === 'POST') {
    
    try {
     
      const { amount, currency, description,bookingId,Booking_Listing_type,CreatedBy} = await req.json() as { amount: number; currency: string; description: string;bookingId:number;Booking_Listing_type:string;CreatedBy:number };

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency || 'usd',
              product_data: {
                name: description || 'One-time Payment',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/cancel`,
        metadata: {
          bookingId,
          Booking_Listing_type,
          CreatedBy
        },
      });

      return NextResponse.json({ sessionId: session.id }, { status: 200 });
    } 
    catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
