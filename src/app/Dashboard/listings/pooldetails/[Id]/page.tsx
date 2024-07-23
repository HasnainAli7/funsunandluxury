"use client";
import React, { useEffect, useState } from 'react';
import Input from "@/shared/Input";
import FormItem from "@/app/add-pool-listing/FormItem";
import Checkbox from "@/shared/Checkbox";
import Textarea from "@/shared/Textarea";

const PoolDetails:React.FC<any> = ({params}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [poolListings, setPoolListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/pool/pool-detail/' + params.Id);
        if (!response.ok) {
          throw new Error('Failed to fetch pool listings');
        }
        const data = await response.json();
        setPoolListings(data);
        setError(undefined);
      } catch (error:any) {
        setError(error.message || 'Failed to fetch pool listings');
      } finally {
        setLoading(false);
      }
    };
    fetchPoolDetails();
  }, [params.Id]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <> 
    {
     poolListings.length > 0 && (
    <div className="container-fluid">

      <div className="card">
        <div className="card-header" style={{background:"#000",color:"#ffff"}}><h3>Pool Listing Details</h3></div>
        <div className="card-body">

          <div className="row">

            <div className="col-md-6">

              <div className="form-group">
                <FormItem label="Pool Title">
                  <Input disabled value={poolListings[0].pool_title} />
                </FormItem>
              </div>

              <FormItem label="Availability Date"/>

              <div className="row">


                <div className="form-group mr-3">
                  <Input disabled value={poolListings[0].availability_date.split(",")[0]} />
                </div>

                <div className="form-group">
                 <Input disabled value={poolListings[0].availability_date.split(",")[1]} />
                </div>


              </div>

              <div className="form-group">

                <FormItem label="Any dates you would like to block out(separate with comma):"/>
                <Input className="col-md-5" disabled value={poolListings[0].blockout_dates} />
              </div>

              <div className="form-group">
               
                <FormItem label="Pool Address"/>
                <Input value={poolListings[0].pool_address} disabled />
              </div>


              <div className="row">

                <div className="col">
                  <div className="form-group mr-3">
                    <FormItem label="City"/>
                    <Input disabled value={poolListings[0].city} />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <FormItem label="State"/>
                    <Input disabled value={poolListings[0].state} />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <FormItem label="Zip Code"/>
                    <Input disabled value={poolListings[0].zip_code} />
                  </div>
                </div>


              </div>

              <div className="form-group">
                <FormItem label="Phone Number"/>
                <Input  disabled value={poolListings[0].phone_number} />
              </div>

              <div className="row">

                <div className="col">
                  <div className="form-group mr-3">
                    <FormItem label="Pool Width"/>
                    <Input disabled value={poolListings[0].pool_width}/>
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <FormItem label="Pool Length"/>
                    <Input  disabled value={poolListings[0].pool_length}/>
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <FormItem label="Pool Depth"/>
                    <Input disabled value={poolListings[0].pool_depth} />
                  </div>
                </div>


              </div>

              <div className="space-y-8">

                <FormItem label="How many vehicles can your property accommodate?">

                  <Input value={poolListings[0].vehicles_accommodate} disabled />

                </FormItem>


                <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-5">

                  <FormItem label="1-5 Guests Hourly Rate ($)">
                    <Input type="number" disabled value={Number(poolListings[0].guest_rate_1_5)} />

                  </FormItem>

                  <FormItem label="6-10 Guests Hourly Rate ($)">

                    <Input  disabled value={Number(poolListings[0].guest_rate_6_10)}  />

                  </FormItem>

                  <FormItem label="11-20 Guests Hourly Rate ($)">
                    <Input type="number"  disabled value={Number(poolListings[0].guest_rate_11_20)}  />

                  </FormItem>

                </div>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-5">

                  <FormItem label="21-30 Guests Hourly Rate ($)">
                    <Input type="number"  disabled value={Number(poolListings[0].guest_rate_21_30)}  />

                  </FormItem>

                  <FormItem label="31-40 Guests Hourly Rate ($)">

                    <Input  type="number"  disabled value={Number(poolListings[0].guest_rate_31_40)}  />
                  </FormItem>

                  <FormItem label="41-50 Guests Hourly Rate ($)">
                    <Input type="number"  disabled value={Number(poolListings[0].guest_rate_41_50)}  />
                  </FormItem>

                </div>


                <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-5">

                  <FormItem label="51-65 Guests Hourly Rate ($)">
                    <Input type="number"  disabled value={Number(poolListings[0].guest_rate_51_65)}  />
                  </FormItem>

                  <FormItem label="66-80 Guests Hourly Rate ($)">

                    <Input type="number"   disabled value={Number(poolListings[0].guest_rate_66_80)}  />
                  </FormItem>

                  <FormItem label="81-100 Guests Hourly Rate ($)">
                    <Input type="number"  disabled value={Number(poolListings[0].guest_rate_81_100)}  />
                  </FormItem>

                </div>

                <div className="grid grid-flow-col auto-cols-ma gap-8 md:gap-5">

                  <FormItem label="Your Pool capacity, how many guests can you have?">
                    <Input type="number" disabled value={Number(poolListings[0].pool_capacity)}  />

                  </FormItem>


                  <FormItem label="How many pets are allowed?" >
                    <Input placeholder="For example 0 or 0-100" disabled value={Number(poolListings[0].pets_allowed)}  />

                  </FormItem>


                </div>

              </div>

              <div className="space-y-8">

                <div>
                  <label className="text-lg font-semibold" htmlFor="">
                    What type of restrooms will your space provide?
                  </label>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Checkbox label="Residence Bath" name="restrooms_residence" disabled={true}  defaultChecked={poolListings[0].restrooms_residence==1?true:false} />
                    <Checkbox label="Portable Restroom" name="restrooms_portable" disabled={true} defaultChecked={poolListings[0].restrooms_portable==1?true:false} />
                    <Checkbox label="Private Restroom" name="restrooms_private" disabled={true}  defaultChecked={poolListings[0].restrooms_private==1?true:false} />
                    <Checkbox label="Offsite Restroom" name="restrooms_offsite"disabled={true}  defaultChecked={poolListings[0].restrooms_offsite==1?true:false} />
                  </div>
                </div>


                <div>
                  <label className="text-lg font-semibold" htmlFor="">
                    Venue space parking
                  </label>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Checkbox label="Parking Lot" name="parking_lot" disabled={true}  defaultChecked={poolListings[0].parking_lot==1?true:false} />
                    <Checkbox label="Street Parking" name="street_parking" disabled={true}  defaultChecked={poolListings[0].street_parking==1?true:false} />


                  </div>
                </div>



                <div>
                  <label className="text-lg font-semibold" htmlFor="">
                    What entertainment options are allowed at your pool space?
                  </label>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Checkbox label="Alcohol" name="entertainment_alcohol" disabled={true}  defaultChecked={poolListings[0].entertainment_alcohol==1?true:false} />
                    <Checkbox label="Smoking" name="entertainment_smoking" disabled={true}  defaultChecked={poolListings[0].entertainment_smoking==1?true:false} />
                    <Checkbox label="Parties" name="entertainment_parties"disabled={true}  defaultChecked={poolListings[0].entertainment_parties==1?true:false} />
                  </div>
                </div>




                <div>
                  <label className="text-lg font-semibold" htmlFor="">
                    What amenities does your property have?
                  </label>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <Checkbox label="Speakers" name="amenities_speakers" disabled={true}  defaultChecked={poolListings[0].amenities_speakers==1?true:false} />
                    <Checkbox label="Grill" name="amenities_grill" disabled={true}  defaultChecked={poolListings[0].amenities_grill==1?true:false} />
                    <Checkbox label="Brick Oven" name="amenities_brick_oven" disabled={true}  defaultChecked={poolListings[0].amenities_brick_oven==1?true:false} />
                    <Checkbox label="Playground" name="amenities_playground" disabled={true} defaultChecked={poolListings[0].amenities_playground==1?true:false} />
                    <Checkbox label="Tennis Court" name="amenities_tennis_court" disabled={true} defaultChecked={poolListings[0].amenities_tennis_court==1?true:false} />
                    <Checkbox label="Volleyball Court" name="amenities_volleyball_court" disabled={true} defaultChecked={poolListings[0].amenities_volleyball_court==1?true:false} />
                    <Checkbox label="Basketball Court" name="amenities_basketball_court" disabled={true} defaultChecked={poolListings[0].amenities_basketball_court==1?true:false} />
                    <Checkbox label="Sauna" name="amenities_sauna" disabled={true} defaultChecked={poolListings[0].amenities_sauna==1?true:false} />
                    <Checkbox label="WIFI" name="amenities_wifi" disabled={true}  defaultChecked={poolListings[0].amenities_wifi==1?true:false} />
                    <Checkbox label="Table & Chairs" name="amenities_table_chairs" disabled={true}  defaultChecked={poolListings[0].amenities_table_chairs==1?true:false} />

                  </div>
                </div>



              </div>

              <div className="my-3">
                <label className="text-lg font-semibold" htmlFor="">Description/Details/Rules/Notes</label>
              </div>

              <Textarea placeholder="..." rows={14} className="mb-3" disabled value={poolListings[0].description} />
              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">

                <Checkbox name="flexible_clause" disabled={true}  defaultChecked={poolListings[0].flexible_clause==1?true:false} className="pr-4" /> Flexible Clause: Guest can Cancel Booking until 7 days before the event start time and will receive full reimbursement (including all fees) of their Booking Price.
              </span></div>
              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
                <Checkbox name="clause_30_day" disabled={true}  defaultChecked={poolListings[0].clause_30_day==1?true:false} className="pr-4" />   30 Day Clause: Guests may cancel their Booking until 30 days before the event start time and will receive a full reimbursement (including all Fees) of their Booking Price. Guests may cancel their Booking between 30 and 7 days before the event start time and receive a 50% refund (excluding Fees) of their Booking Price. Cancellations submitted less than 7 days before the Event start time are non refundable.
              </span></div>
              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
                <Checkbox name="clause_24_hour" disabled={true}  defaultChecked={poolListings[0].clause_24_hour==1?true:false} className="pr-4" /> 24 Hour Clause: Guests may cancel their Booking until 24 hours before the event start time and will receive a full refund (including all fees) of their Booking Price. Booking cancellations submitted less than 24 hours before the Event start time are non refundable.
              </span></div>


              <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
                <Checkbox name="terms_conditions" disabled={true}  defaultChecked={poolListings[0].terms_conditions==1?true:false} className="pr-4" /> I agree to Terms and Conditions
              </span>
              </div>

            </div>


            <div className="col-md-6">
           
              <label className="text-lg font-semibold" ><span className="mb-3">Cover Image</span></label>
               
               <div className="w-100">
             
                <img src={poolListings[0].pool_cover_image} className="img-fluid img-thumbnail" alt="Cinque Terre"/>

                </div>
                  
                <div className="my-3">
                 <label className="text-lg font-semibold" ><span>Places Images</span></label>
                </div>

                <div className="row">
                {poolListings[0].pool_images.split(",").map((item:any, index:any) => (
                  <div className="col-md-4" key={index}>
                    <div className="w-100">
                      <img src={item} className="img-fluid img-thumbnail" alt="Pool Image" />
                    </div>
                  </div>
                ))}
              </div>
        

            </div>

          </div>

        </div>




      </div>
    </div>
      )}
    </>
  );
};

export default PoolDetails;