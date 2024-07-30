import type { Route as NextRoute } from "next";
import { ComponentType } from "react";

// Get ready to update to nextjs version 13.2 with X typedRoutes
export type Route<T = string> = NextRoute;
export type PathName = Route;

export interface Page {
  path: PathName;
  exact?: boolean;
  component: ComponentType<Object>;
}

// types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  Profile_ImagePath:string;
}

export interface JwtPayload extends User {
  user: any;
  // Add any additional JWT payload properties if needed
  exp: number;  // Example: JWT expiration time
  iat: number;  // Example: JWT issued at time
}


export interface Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  Description:string;
  Profile:File;
  Profile_ImagePath:string;
  Registration_Type:number

}


export interface VenueSpace {
  id: number;
  title: string;
  availability_date:string;
  block_out_dates: string;
  space_address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  venue_type: string;
  onsite_parking_free: boolean;
  onsite_parking_paid: boolean;
  street_parking: boolean;
  valet_service: boolean;
  no_parking: boolean;
  vehicle_accommodation: number;
  speakers: boolean;
  grill: boolean;
  brick_oven: boolean;
  playground: boolean;
  tennis_court: boolean;
  volleyball_court: boolean;
  basketball_court: boolean;
  sauna: boolean;
  wifi: boolean;
  table_chairs: boolean;
  additional_amenities: string;
  number_of_rooms: number;
  square_footage: number;
  hosting_hours: number;
  surveillance_systems: boolean;
  hourly_rate: number;
  flat_rate: number;
  minimum_hours: number;
  guest_capacity: number;
  venueimage: File[];
  Venue_cover_image:File;
  description: string;
  flexible_clause: boolean;
  thirty_day_clause: boolean;
  twenty_four_hour_clause: boolean;
  terms_agreement: boolean;
  Status: string;
  Country: string;
  latitude: string;
  longitude: string;
  place:String;
  createdBy: number;
}


export interface PoolListing {
  id: number;
  pool_title: string;
  availability_date: string;
  blockout_dates: string; 
  pool_address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  pool_width: number;
  pool_length: number;
  pool_depth: number;
  vehicles_accommodate: string;
  restrooms_residence: boolean;
  restrooms_portable: boolean;
  restrooms_private: boolean;
  restrooms_offsite: boolean;
  parking_lot: boolean;
  street_parking: boolean;
  guest_rate_1_5: number | null; 
  guest_rate_6_10: number | null;
  guest_rate_11_20: number | null;
  guest_rate_21_30: number | null;
  guest_rate_31_40: number | null;
  guest_rate_41_50: number | null;
  guest_rate_51_65: number | null;
  guest_rate_66_80: number | null;
  guest_rate_81_100: number | null;
  pool_capacity: number;
  pets_allowed: number;
  entertainment_alcohol: boolean;
  entertainment_smoking: boolean;
  entertainment_parties: boolean;
  amenities_speakers: boolean;
  amenities_grill: boolean;
  amenities_brick_oven: boolean;
  amenities_playground: boolean;
  amenities_tennis_court: boolean;
  amenities_volleyball_court: boolean;
  amenities_basketball_court: boolean;
  amenities_sauna: boolean;
  amenities_wifi: boolean;
  amenities_table_chairs: boolean;
  description: string;
  flexible_clause: boolean;
  clause_30_day: boolean;
  clause_24_hour: boolean;
  terms_conditions: boolean;
  pool_images: File[];
  pool_cover_image:File;
  Status: string;
  Country: string;
  latitude: string;
  longitude: string;
  place:String;
  createdBy: number;
}

export interface Role {
  id: number;
  role_name: string;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface Booking {
  TotalAdults: number;
  TotalChildren: number;
  TotalInfants: number;
  ListingType: 'Venue' | 'Pool';
  StoreListingID: number;
  TotalAmount: number;
  TotalHours: number;
  TotalGuest: number;
  BookingDate: string;
  CreatedBookingUserID: number;
}

export interface CustomerReview {
  id: number;
  venue_id: number;
  pool_Id: number;
  listing_type: string;
  review: string;
  rating: number;
  review_date: string;
  createdBy: number;
  modifiedBy: number;
  createdOn: string;
  modifiedOn: string;
  status: string;
}