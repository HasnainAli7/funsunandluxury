import React, { FC } from "react";
import Select from "@/shared/Select";
import FormItem from "@/app/add-pool-listing/FormItem";
import Input from "@/shared/Input";
import { useFormState } from "@/app/add-pool-listing/FormContext";
import { useForm } from "react-hook-form";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { PoolListing } from "@/routers/types"
export interface PageAddListing3Props { }

const PageAddListing3: FC<PageAddListing3Props> = () => {

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

        <FormItem label="How many vehicles can your property accommodate?">

          <Input {...register('vehicles_accommodate', { required: 'vehicles accommodate is required' })} />

          {errors.vehicles_accommodate && <span className="text-red-600 text-sm">{errors.vehicles_accommodate.message}</span>}

        </FormItem>


        <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-5">

          <FormItem label="1-5 Guests Hourly Rate ($)">
            <Input type="number" {...register('guest_rate_1_5', { required: '1-5 Guests is required' })} />
            {errors.guest_rate_1_5 && <span className="text-red-600 text-sm">{errors.guest_rate_1_5.message}</span>}
          </FormItem>

          <FormItem label="6-10 Guests Hourly Rate ($)">

            <Input  {...register('guest_rate_6_10', { required: '6-10 Guests is required' })} />
            {errors.guest_rate_6_10 && <span className="text-red-600 text-sm">{errors.guest_rate_6_10.message}</span>}
          </FormItem>

          <FormItem label="11-20 Guests Hourly Rate ($)">
            <Input type="number" {...register('guest_rate_11_20', { required: '11-20 Guests is required' })} />
            {errors.guest_rate_11_20 && <span className="text-red-600 text-sm">{errors.guest_rate_11_20.message}</span>}
          </FormItem>

        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-5">

        <FormItem label="21-30 Guests Hourly Rate ($)">
          <Input type="number" {...register('guest_rate_21_30', { required: '21-30 Guests is required' })} />
          {errors.guest_rate_21_30 && <span className="text-red-600 text-sm">{errors.guest_rate_21_30.message}</span>}
        </FormItem>

        <FormItem label="31-40 Guests Hourly Rate ($)">

          <Input  {...register('guest_rate_31_40', { required: '31-40 Guests is required' })} />
          {errors.guest_rate_31_40 && <span className="text-red-600 text-sm">{errors.guest_rate_31_40.message}</span>}
        </FormItem>

        <FormItem label="41-50 Guests Hourly Rate ($)">
          <Input type="number" {...register('guest_rate_41_50', { required: '41-50 Guests is required' })} />
          {errors.guest_rate_41_50 && <span className="text-red-600 text-sm">{errors.guest_rate_41_50.message}</span>}
        </FormItem>

        </div>


        <div className="grid grid-cols-3 md:grid-cols-3 gap-8 md:gap-5">

          <FormItem label="51-65 Guests Hourly Rate ($)">
            <Input type="number" {...register('guest_rate_51_65', { required: '51-65 Guests is required' })} />
            {errors.guest_rate_51_65 && <span className="text-red-600 text-sm">{errors.guest_rate_51_65.message}</span>}
          </FormItem>

          <FormItem label="66-80 Guests Hourly Rate ($)">

            <Input  {...register('guest_rate_66_80', { required: '66-80 Guests is required' })} />
            {errors.guest_rate_66_80 && <span className="text-red-600 text-sm">{errors.guest_rate_66_80.message}</span>}
          </FormItem>

          <FormItem label="81-100 Guests Hourly Rate ($)">
            <Input type="number" {...register('guest_rate_81_100', { required: '81-100 Guests is required' })} />
            {errors.guest_rate_81_100 && <span className="text-red-600 text-sm">{errors.guest_rate_81_100.message}</span>}
          </FormItem>

          </div>

          <div className="grid grid-flow-col auto-cols-ma gap-8 md:gap-5">

             <FormItem label="Your Pool capacity, how many guests can you have?">
              <Input  type="number" {...register('pool_capacity', { required: 'Pool capacity is required' })} />
              {errors.pool_capacity && <span className="text-red-600 text-sm">{errors.pool_capacity.message}</span>}
            </FormItem>
          

            <FormItem label="How many pets are allowed?" >
              <Input placeholder="For example 0 or 0-100" {...register('pets_allowed', { required: 'Pets allowed is required' })} />
              {errors.pets_allowed && <span className="text-red-600 text-sm">{errors.pets_allowed.message}</span>}
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
