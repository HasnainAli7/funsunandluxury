import React, { FC } from "react";
import Select from "@/shared/Select";
import FormItem from "@/app/add-venue-listing/FormItem";
import Input from "@/shared/Input";
import { useFormState } from "@/app/add-venue-listing/FormContext";
import { useForm } from "react-hook-form";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { VenueSpace } from "@/routers/types"
export interface PageAddListing3Props { }

const PageAddListing3: FC<PageAddListing3Props> = () => {

  const { onHandleNext, setFormData, onHandleBack, formData, step } = useFormState();
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<VenueSpace>({
    defaultValues: formData,
  });

  const onHandleFormSubmit = (data: VenueSpace) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  };

  const surveillanceChange = (e: any) => {
    const value = e.target.value;
    setValue('surveillance_systems', value); // Update the value in the form state
    if (value) {
      clearErrors('surveillance_systems'); // Clear errors if a valid option is selected
    }
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

      <h2 className="text-2xl font-semibold">Size of your location</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>


      <div className="space-y-8">

        <FormItem label="Additional Amenities and Cost (ADD-ONS)">

          <Input {...register('additional_amenities', { required: 'Additional amenities is required' })} />

          {errors.additional_amenities && <span className="text-red-600 text-sm">{errors.additional_amenities.message}</span>}

        </FormItem>

        <FormItem label="How many vehicles can your property accommodate?">

        <Input type="number"  {...register('vehicle_accommodation', { required: 'Vehicle accommodation is required' })} />

        {errors.vehicle_accommodation && <span className="text-red-600 text-sm">{errors.vehicle_accommodation.message}</span>}

        </FormItem>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-5">
          <FormItem label="How many rooms does the property have?">
            <Input type="number"   {...register('number_of_rooms', { required: 'Number of rooms is required' })} />
            {errors.number_of_rooms && <span className="text-red-600 text-sm">{errors.number_of_rooms.message}</span>}
          </FormItem>

          <FormItem label="What is the square footage (SF) of your space?">
            <Input type="number" {...register('square_footage', { required: 'Square footage is required' })} />
            {errors.square_footage && <span className="text-red-600 text-sm">{errors.square_footage.message}</span>}
          </FormItem>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-5">

          <FormItem label="Hosting Hours">
            <Input type="number" {...register('hosting_hours', { required: 'Hosting hours is required' })} />
            {errors.hosting_hours && <span className="text-red-600 text-sm">{errors.hosting_hours.message}</span>}
          </FormItem>


          <FormItem label="Do you have surveillance systems and or 24/7 recording devices onsite?">

            <Select  {...register('surveillance_systems', { required: 'Surveillance systems is required' })}
              onChange={(e) => {
                surveillanceChange(e);
                register('surveillance_systems').onChange(e);
              }}>
              <option value="" disabled selected>Select a Surveillance systems</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
            {errors.surveillance_systems && <span className="text-red-600 text-sm">{errors.surveillance_systems.message}</span>}
          </FormItem>

        </div>


        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-5">

          <FormItem label="Hourly rate">
            <Input type="number" {...register('hourly_rate', { required: 'Hourly rate is required' })} />
            {errors.hourly_rate && <span className="text-red-600 text-sm">{errors.hourly_rate.message}</span>}
          </FormItem>

          <FormItem label="Flate rate">

            <Input  {...register('flat_rate', { required: 'Flat rate is required' })} />
            {errors.flat_rate && <span className="text-red-600 text-sm">{errors.flat_rate.message}</span>}
          </FormItem>

          <FormItem label="Minumum Numbers of Hours">
            <Input type="number" {...register('minimum_hours', { required: 'Minimum hours is required' })} />
            {errors.minimum_hours && <span className="text-red-600 text-sm">{errors.minimum_hours.message}</span>}
          </FormItem>

          <FormItem label="Guest Capacity">
            <Input placeholder="12-16 etc"  {...register('guest_capacity', { required: 'Guest capacity is required' })} />
            {errors.guest_capacity && <span className="text-red-600 text-sm">{errors.guest_capacity.message}</span>}
          </FormItem>


        </div>
      </div>

      <div className="flex justify-end space-x-5">
        <ButtonSecondary onClick={onHandleBack}>Go back</ButtonSecondary>
        <ButtonPrimary >{"Next"}</ButtonPrimary>
      </div>
    </form>
  );
};

export default PageAddListing3;
