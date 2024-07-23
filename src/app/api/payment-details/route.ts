import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connect } from '@/utils/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET(req: NextRequest) {
 
  const { searchParams } = new URL(req.url);
 
  const session_id = searchParams.get('session_id');

  if (!session_id) {

    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });

  }

  const connection = await connect();

  try {



    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }



    if (!connection) {
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }


    const paymentDetails = {
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      bookingId: session.metadata?.bookingId,
      Booking_Listing_type: session.metadata?.Booking_Listing_type,
      payment_status: session.payment_status,
      payment_types: session.payment_method_types.join(', '),
      status: session.status,
      CreatedBy:session.metadata?.CreatedBy,
    };


    const [rows] = await connection.query('SELECT * FROM payments WHERE stripe_session_id = ?', [paymentDetails.id]);


    const existingPayment = rows as any[];

    if (existingPayment.length > 0) {


      if (paymentDetails.Booking_Listing_type === "VENUE LISTING") {

        const [rows] = await connection.query(`SELECT vs.title, vs.Country, vs.city, vs.venue_cover_image_base64 AS image, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types, AVG(cr.rating) AS average_rating, COUNT(cr.id) AS review_count FROM venue_spaces AS vs INNER JOIN bookinglisting AS bl ON vs.id = bl.StoreListingID AND bl.ListingType = 'Venue' INNER JOIN payments AS p ON p.booking_id = bl.BookingID LEFT JOIN customer_reviews AS cr ON vs.id = cr.venue_id WHERE p.booking_id = ? GROUP BY vs.id, vs.title, vs.Country, vs.city, vs.venue_cover_image_base64, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types `, [paymentDetails.bookingId]);
  
        const venueData = rows as any[];

        return NextResponse.json({ BookingDetails: venueData[0] });

      }

      else if (paymentDetails.Booking_Listing_type === "POOL LISTING") {

        const [rows] = await connection.query(` SELECT pl.pool_title AS title, pl.Country, pl.city, pl.pool_cover_image AS image, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types, AVG(cr.rating) AS average_rating, COUNT(cr.id) AS review_count FROM poollisting AS pl INNER JOIN bookinglisting AS bl ON pl.id = bl.StoreListingID AND bl.ListingType = 'Pool' INNER JOIN payments AS p ON p.booking_id = bl.BookingID LEFT JOIN customer_reviews AS cr ON pl.id = cr.pool_Id WHERE p.booking_id = ? GROUP BY pl.id, pl.pool_title, pl.Country, pl.city, pl.pool_cover_image, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types `, [paymentDetails.bookingId]);
       
        const poolData = rows as any[];

        return NextResponse.json({ BookingDetails: poolData[0] });

      }


    }



    await connection.query(
      'INSERT INTO payments (stripe_session_id, amount, currency, email, booking_id, payment_status, payment_types, status, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        paymentDetails.id,
        paymentDetails.amount_total,
        paymentDetails.currency,
        paymentDetails.customer_email,
        paymentDetails.bookingId,
        paymentDetails.payment_status,
        paymentDetails.payment_types,
        paymentDetails.status,
        paymentDetails.CreatedBy
      ]
    );


    if (paymentDetails.Booking_Listing_type === "VENUE LISTING") {

      const [rows] = await connection.query(`SELECT vs.title, vs.Country, vs.city, vs.venue_cover_image_base64 AS image, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types, AVG(cr.rating) AS average_rating, COUNT(cr.id) AS review_count FROM venue_spaces AS vs INNER JOIN bookinglisting AS bl ON vs.id = bl.StoreListingID AND bl.ListingType = 'Venue' INNER JOIN payments AS p ON p.booking_id = bl.BookingID LEFT JOIN customer_reviews AS cr ON vs.id = cr.venue_id WHERE p.booking_id = ? GROUP BY vs.id, vs.title, vs.Country, vs.city, vs.venue_cover_image_base64, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types `, [paymentDetails.bookingId]);
      
      const venueData = rows as any[];

      return NextResponse.json({ BookingDetails: venueData[0] });

    }

    else if (paymentDetails.Booking_Listing_type === "POOL LISTING") {

      const [rows] = await connection.query(` SELECT pl.pool_title AS title, pl.Country, pl.city, pl.pool_cover_image AS image, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types, AVG(cr.rating) AS average_rating, COUNT(cr.id) AS review_count FROM poollisting AS pl INNER JOIN bookinglisting AS bl ON pl.id = bl.StoreListingID AND bl.ListingType = 'Pool' INNER JOIN payments AS p ON p.booking_id = bl.BookingID LEFT JOIN customer_reviews AS cr ON pl.id = cr.pool_Id WHERE p.booking_id = ? GROUP BY pl.id, pl.pool_title, pl.Country, pl.city, pl.pool_cover_image, bl.BookingDate, bl.TotalGuest, p.amount, p.payment_status, p.payment_types `, [paymentDetails.bookingId]);
     
      const poolData = rows as any[];

      return NextResponse.json({ BookingDetails: poolData[0] });

    }

    await connection?.end();

  } catch (error: any) {

    await connection?.end();

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  finally {
    await connection?.end();
  }
}
