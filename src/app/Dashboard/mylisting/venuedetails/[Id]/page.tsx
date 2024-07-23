"use client";
import { ReactNode } from "react";
import Input from "@/shared/Input";
import FormItem from "@/app/add-venue-listing/FormItem";
import Checkbox from "@/shared/Checkbox";
import Textarea from "@/shared/Textarea";
import Select from "@/shared/Select";
import React, {FC ,useEffect, useState } from 'react';

  const VenueDetails:React.FC<any> = ({params}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [venueListings, setvenueListings] = useState<any[]>([]);
  
    

    useEffect(() => {
      const fetchVenueDetails = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/venue/venue-detail/' + params.Id);
          if (!response.ok) {
            throw new Error('Failed to fetch venue listings');
          }
          const data = await response.json();
          setvenueListings(data.VenueDetails);
          setError(undefined);
        } catch (error:any) {
          setError(error.message || 'Failed to fetch venue listings');
        } finally {
          setLoading(false);
        }
      };
      fetchVenueDetails();
    }, [params.Id]);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

  return (
    <>
    {venueListings.length >0 &&
    <div className="container-fluid">

      <div className="card">
        <div className="card-header" style={{ background: "#000", color: "#ffff" }}><h3>Venue Listing Details</h3></div>
        <div className="card-body">

          <div className="row">

            <div className="col-md-6">

              <div className="form-group">
                <FormItem label="Venue Space Title">
                  <Input disabled value={venueListings[0].title} />
                </FormItem>
              </div>

              <FormItem label="Availability Date" />

              <div className="row">


                <div className="form-group mr-3">
                  <Input disabled value={"06/28/2024"} />
                </div>

                <div className="form-group">
                  <Input disabled  value={"06/28/2024"} />
                </div>


              </div>

              <div className="form-group">

                <FormItem label="Any dates you would like to Block out" />

                <Input className="col-md-5" disabled  value={"06/28/2024"} />
              </div>

              <div className="form-group">

                <FormItem label="Space Address"  />
                <Input disabled value={venueListings[0].space_address} />
              </div>


              <div className="row">

                <div className="col">
                  <div className="form-group mr-3">
                    <FormItem label="City" />
                    <Input disabled value={venueListings[0].city} />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <FormItem label="State" />
                    <Input disabled value={venueListings[0].state} />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <FormItem label="Zip Code" />
                    <Input disabled value={venueListings[0].zip_code} />
                  </div>
                </div>


              </div>

              <div className="form-group">
                <FormItem label="Phone Number" />
                <Input disabled value={venueListings[0].phone_number} />
              </div>

              <FormItem label="venue type">
                <Select disabled defaultValue={venueListings[0].venue_type} value={venueListings[0].venue_type}>
                  <option value="" disabled hidden>Select a venue type</option>
                  <option value="Academic Venue">Academic Venue</option>
                  <option value="Banquet Halls">Banquet Halls</option>
                  <option value="Backyard Outdoor Venue">Backyard Outdoor Venue</option>
                  <option value="Concert Venue">Concert Venue</option>
                  <option value="Event Venue/ Space">Event Venue/ Space</option>
                  <option value="Community Center">Community Center</option>
                  <option value="Concert Halls">Concert Halls</option>
                  <option value="Convention Center">Convention Center</option>
                  <option value="Social Clubs and Lounges">Social Clubs and Lounges</option>
                </Select>
              </FormItem>

              <div className="space-y-8 mt-3">

                <FormItem label="Additional Amenities and Cost (ADD-ONS)">

                  <Input disabled value={venueListings[0].additional_amenities} />
                </FormItem>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-5">
                  <FormItem label="How many rooms does the property have?">
                    <Input type="number"value={venueListings[0].number_of_rooms} disabled />

                  </FormItem>

                  <FormItem label="What is the square footage (SF) of your space?">
                    <Input type="number" value={Number(venueListings[0].square_footage)} disabled />

                  </FormItem>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-5">

                  <FormItem label="Hosting Hours">
                    <Input type="number"  value={Number(venueListings[0].hosting_hours)} disabled  />

                  </FormItem>


                  <FormItem label="Do you have surveillance systems and or 24/7 recording devices onsite?">

                    <Select defaultValue={venueListings[0].surveillance_systems==0?"No":"Yes"} value={venueListings[0].surveillance_systems==0?"No":"Yes"}>
                      <option value="" disabled selected>Select a Surveillance systems</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Select>
                  </FormItem>

                </div>


                <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-5">

                  <FormItem label="Hourly rate">
                    <Input type="number" disabled value={venueListings[0].hourly_rate} />
                  </FormItem>

                  <FormItem label="Flate rate" >

                    <Input disabled value={venueListings[0].flat_rate} />

                  </FormItem>

                  <FormItem label="Minumum Numbers of Hours">

                    <Input type="number" disabled value={venueListings[0].minimum_hours} />

                  </FormItem>

                  <FormItem label="Guest Capacity">

                    <Input placeholder="12-16 etc" disabled value={venueListings[0].guest_capacity}  />

                  </FormItem>


                </div>
              </div>

              <div className="space-y-8 mt-3">


                <div>
                  <label className="text-lg font-semibold" htmlFor="">
                    What are the parking options at or near your venue?
                  </label>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Checkbox label="Onsite Parking Free" name="onsite_parking_free"  disabled defaultChecked={venueListings[0].onsite_parking_free==1?true:false} />
                    <Checkbox label="Onsite Parking Paid" name="onsite_parking_paid"  disabled defaultChecked={venueListings[0].onsite_parking_paid==1?true:false}  />
                    <Checkbox label="Street Parking" name="street_parking"  disabled defaultChecked={venueListings[0].street_parking==1?true:false}  />
                    <Checkbox label="Valet Service" name="valet_service"  disabled defaultChecked={venueListings[0].valet_service==1?true:false}  />
                    <Checkbox label="No Parking" name="no_parking"  disabled defaultChecked={venueListings[0].no_parking==1?true:false}  />

                  </div>
                </div>

                <div>
                  <label className="text-lg font-semibold" htmlFor="">
                    What amenities does your property have?:
                  </label>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Checkbox label="Speakers" name="speakers"  disabled defaultChecked={venueListings[0].speakers==1?true:false}  />
                    <Checkbox label="Grill" name="grill"  disabled defaultChecked={venueListings[0].grill==1?true:false}  />
                    <Checkbox label="Brick Oven" name="brick_oven"  disabled defaultChecked={venueListings[0].brick_oven==1?true:false}  />
                    <Checkbox label="Playground" name="playground"  disabled defaultChecked={venueListings[0].playground==1?true:false}  />
                    <Checkbox label="Tennis Court" name="tennis_court"  disabled defaultChecked={venueListings[0].tennis_court==1?true:false}  />
                    <Checkbox label="Volleyball Court" name="volleyball_court"  disabled defaultChecked={venueListings[0].volleyball_court==1?true:false}  />
                    <Checkbox label="Basketball Court" name="basketball_court"  disabled defaultChecked={venueListings[0].basketball_court==1?true:false}  />
                    <Checkbox label="Sauna" name="sauna"  disabled defaultChecked={venueListings[0].sauna==1?true:false}  />
                    <Checkbox label="WIFI" name="wifi"  disabled defaultChecked={venueListings[0].wifi==1?true:false}  />
                    <Checkbox label="Table & Chairs" name="table_chairs"  disabled defaultChecked={venueListings[0].table_chairs==1?true:false}  />

                  </div>
                </div>



              </div>
              <div className="mt-3 mb-4">
                <label className="text-lg font-semibold" htmlFor="">Description</label>
                <Textarea placeholder="..." rows={14} disabled value={venueListings[0].description} />
              </div>

              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">

                <Checkbox name="flexible_clause"  disabled defaultChecked={venueListings[0].flexible_clause==1?true:false}  className="pr-4" /> Flexible Clause: Guest can Cancel Booking until 7 days before the event start time and will receive full reimbursement (including all fees) of their Booking Price.
              </span></div>
              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
                <Checkbox name="thirty_day_clause"  disabled defaultChecked={venueListings[0].thirty_day_clause==1?true:false}  className="pr-4" />   30 Day Clause: Guests may cancel their Booking until 30 days before the event start time and will receive a full reimbursement (including all Fees) of their Booking Price. Guests may cancel their Booking between 30 and 7 days before the event start time and receive a 50% refund (excluding Fees) of their Booking Price. Cancellations submitted less than 7 days before the Event start time are non refundable.
              </span></div>
              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
                <Checkbox name="twenty_four_hour_clause"  disabled defaultChecked={venueListings[0].twenty_four_hour_clause==1?true:false}  className="pr-4" /> 24 Hour Clause: Guests may cancel their Booking until 24 hours before the event start time and will receive a full refund (including all fees) of their Booking Price. Booking cancellations submitted less than 24 hours before the Event start time are non refundable.
              </span></div>


              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
                <Checkbox name="terms_agreement"  disabled defaultChecked={venueListings[0].terms_agreement==1?true:false}  className="pr-4" /> I agree to Terms and Conditions
              </span>
              </div>


            </div>


            <div className="col-md-6">

              <label className="text-lg font-semibold" ><span className="mb-3">Cover Image</span></label>

              <div className="w-100">

                <img src={venueListings[0].venue_cover_image_base64} className="img-fluid img-thumbnail" alt="Cinque Terre" />

              </div>

              <div className="my-3">
                <label className="text-lg font-semibold" ><span>Places Images</span></label>
              </div>

              <div className="row">

              {venueListings[0].venueimage_base64.split(",").map((item:any, index:any) => (
                  <div className="col-md-4" key={index}>
                    <div className="w-100">
                      <img src={item} className="img-fluid img-thumbnail" alt="Venue Image" />
                    </div>
                  </div>
                ))}

              </div>


            </div>

          </div>

        </div>




      </div>
    </div>
    }
    </>
    
  );
};

export default VenueDetails;