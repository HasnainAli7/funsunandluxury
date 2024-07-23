import React, { FC } from "react";
import Checkbox from "@/shared/Checkbox";
import { useFormState } from "@/app/add-venue-listing/FormContext";
import { useForm } from "react-hook-form";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { VenueSpace } from "@/routers/types"
export interface PageAddListing4Props {}

const PageAddListing4: FC<PageAddListing4Props> = () => {

    const { onHandleNext, setFormData, onHandleBack, formData, step } = useFormState();
      const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<VenueSpace>({
      defaultValues: formData,
    });
  
    const onHandleFormSubmit = (data: VenueSpace) => {
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

      <div>
        <h2 className="text-2xl font-semibold">Amenities </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Many customers have searched for accommodation based on amenities
          criteria
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <div className="space-y-8">
       

        <div>
          <label className="text-lg font-semibold" htmlFor="">
             What are the parking options at or near your venue?
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Checkbox label="Onsite Parking Free" name="onsite_parking_free" defaultChecked={false} onChange={(checked) => setValue("onsite_parking_free", checked)}/>
            <Checkbox label="Onsite Parking Paid" name="onsite_parking_paid" defaultChecked={false} onChange={(checked) => setValue("onsite_parking_paid", checked)}/>
            <Checkbox label="Street Parking" name="street_parking" defaultChecked={false} onChange={(checked) => setValue("street_parking", checked)}/>
            <Checkbox label="Valet Service" name="valet_service" defaultChecked={false} onChange={(checked) => setValue("valet_service", checked)}/>
            <Checkbox label="No Parking" name="no_parking" defaultChecked={false} onChange={(checked) => setValue("no_parking", checked)}/>

          </div>
        </div>

        <div>
          <label className="text-lg font-semibold" htmlFor="">
            What amenities does your property have?:
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Checkbox label="Speakers" name="speakers" defaultChecked={false} onChange={(checked) => setValue("speakers", checked)}/>
            <Checkbox label="Grill" name="grill" defaultChecked={false} onChange={(checked) => setValue("grill", checked)}/>
            <Checkbox label="Brick Oven" name="brick_oven" defaultChecked={false} onChange={(checked) => setValue("brick_oven", checked)}/>
            <Checkbox label="Playground" name="playground" defaultChecked={false} onChange={(checked) => setValue("playground", checked)}/>
            <Checkbox label="Tennis Court" name="tennis_court" defaultChecked={false} onChange={(checked) => setValue("tennis_court", checked)}/>
            <Checkbox label="Volleyball Court" name="volleyball_court" defaultChecked={false} onChange={(checked) => setValue("volleyball_court", checked)}/>
            <Checkbox label="Basketball Court" name="basketball_court" defaultChecked={false} onChange={(checked) => setValue("basketball_court", checked)}/>
            <Checkbox label="Sauna" name="sauna" defaultChecked={false} onChange={(checked) => setValue("sauna", checked)}/>
            <Checkbox label="WIFI" name="wifi" defaultChecked={false} onChange={(checked) => setValue("wifi", checked)}/>
            <Checkbox label="Table & Chairs" name="table_chairs" defaultChecked={false} onChange={(checked) => setValue("table_chairs", checked)}/>

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
