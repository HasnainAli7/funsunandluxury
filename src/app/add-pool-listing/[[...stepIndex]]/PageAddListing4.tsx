import React, { FC } from "react";
import Checkbox from "@/shared/Checkbox";
import { useFormState } from "@/app/add-pool-listing/FormContext";
import { useForm } from "react-hook-form";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { PoolListing } from "@/routers/types"
export interface PageAddListing4Props {}

const PageAddListing4: FC<PageAddListing4Props> = () => {

    const { onHandleNext, setFormData, onHandleBack, formData, step } = useFormState();
      const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<PoolListing>({
      defaultValues: formData,
    });
  
    const onHandleFormSubmit = (data: PoolListing) => {
      setFormData((prev: any) => ({ ...prev, ...data }));
      onHandleNext();
    };
  
  return (
    <form onSubmit={handleSubmit(onHandleFormSubmit)} className="listingSection__wrap">

    <div className="space-y-11">
      <div>
        <span className="text-4xl font-semibold">{step}</span>{" "}
        <span className="text-lg text-neutral-500 dark:text-neutral-400">
          / 6
        </span>
      </div>
    </div>

      

      <div className="space-y-8">
       
      <div>
          <label className="text-lg font-semibold" htmlFor="">
            What type of restrooms will your space provide?
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Checkbox label="Residence Bath" name="restrooms_residence" defaultChecked={false} onChange={(checked) => setValue("restrooms_residence", checked)}/>
            <Checkbox label="Portable Restroom" name="restrooms_portable" defaultChecked={false} onChange={(checked) => setValue("restrooms_portable", checked)}/>
            <Checkbox label="Private Restroom" name="restrooms_private" defaultChecked={false} onChange={(checked) => setValue("restrooms_private", checked)}/>
            <Checkbox label="Offsite Restroom" name="restrooms_offsite" defaultChecked={false} onChange={(checked) => setValue("restrooms_offsite", checked)}/>
          </div>
        </div>


        <div>
          <label className="text-lg font-semibold" htmlFor="">
          Venue space parking
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Checkbox label="Parking Lot" name="parking_lot" defaultChecked={false} onChange={(checked) => setValue("parking_lot", checked)}/>
            <Checkbox label="Street Parking" name="street_parking" defaultChecked={false} onChange={(checked) => setValue("street_parking", checked)}/>
          

          </div>
        </div>



        <div>
          <label className="text-lg font-semibold" htmlFor="">
          What entertainment options are allowed at your pool space?
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Checkbox label="Alcohol" name="entertainment_alcohol" defaultChecked={false} onChange={(checked) => setValue("entertainment_alcohol", checked)}/>
            <Checkbox label="Smoking" name="entertainment_smoking" defaultChecked={false} onChange={(checked) => setValue("entertainment_smoking", checked)}/>
            <Checkbox label="Parties" name="entertainment_parties" defaultChecked={false} onChange={(checked) => setValue("entertainment_parties", checked)}/>
          </div>
        </div>




        <div>
          <label className="text-lg font-semibold" htmlFor="">
            What amenities does your property have?
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Checkbox label="Speakers" name="amenities_speakers" defaultChecked={false} onChange={(checked) => setValue("amenities_speakers", checked)}/>
            <Checkbox label="Grill" name="amenities_grill" defaultChecked={false} onChange={(checked) => setValue("amenities_grill", checked)}/>
            <Checkbox label="Brick Oven" name="amenities_brick_oven" defaultChecked={false} onChange={(checked) => setValue("amenities_brick_oven", checked)}/>
            <Checkbox label="Playground" name="amenities_playground" defaultChecked={false} onChange={(checked) => setValue("amenities_playground", checked)}/>
            <Checkbox label="Tennis Court" name="amenities_tennis_court" defaultChecked={false} onChange={(checked) => setValue("amenities_tennis_court", checked)}/>
            <Checkbox label="Volleyball Court" name="amenities_volleyball_court" defaultChecked={false} onChange={(checked) => setValue("amenities_volleyball_court", checked)}/>
            <Checkbox label="Basketball Court" name="amenities_basketball_court" defaultChecked={false} onChange={(checked) => setValue("amenities_basketball_court", checked)}/>
            <Checkbox label="Sauna" name="amenities_sauna" defaultChecked={false} onChange={(checked) => setValue("amenities_sauna", checked)}/>
            <Checkbox label="WIFI" name="amenities_wifi" defaultChecked={false} onChange={(checked) => setValue("amenities_wifi", checked)}/>
            <Checkbox label="Table & Chairs" name="amenities_table_chairs" defaultChecked={false} onChange={(checked) => setValue("amenities_table_chairs", checked)}/>

          </div>
        </div>


  
      </div>
      <div className="flex justify-end space-x-5">
        <ButtonSecondary onClick={onHandleBack}>Go back</ButtonSecondary>
        <ButtonPrimary >{"Next"}</ButtonPrimary>
      </div>
    </form>
  );
};

export default PageAddListing4;
