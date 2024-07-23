import React, { FC } from "react";
import Textarea from "@/shared/Textarea";
import Checkbox from "@/shared/Checkbox";
import { useFormState } from "@/app/add-pool-listing/FormContext";
import { useForm } from "react-hook-form";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { PoolListing } from "@/routers/types"
export interface PageAddListing6Props { }

const PageAddListing5: FC<PageAddListing6Props> = () => {

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
      <div>
          <label className="text-lg font-semibold" htmlFor="">Description/Details/Rules/Notes</label>
      </div>

      <Textarea placeholder="..." rows={14} {...register('description', { required: 'Description is required' })} />
      {errors.description && <span className="text-red-600 text-sm">{errors.description.message}</span>}

      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">

        <Checkbox name="flexible_clause" defaultChecked={false} onChange={(checked) => setValue("flexible_clause", checked)} className="pr-4" /> Flexible Clause: Guest can Cancel Booking until 7 days before the event start time and will receive full reimbursement (including all fees) of their Booking Price.
      </span></div>
      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
        <Checkbox name="clause_30_day" defaultChecked={false} onChange={(checked) => setValue("clause_30_day", checked)} className="pr-4" />   30 Day Clause: Guests may cancel their Booking until 30 days before the event start time and will receive a full reimbursement (including all Fees) of their Booking Price. Guests may cancel their Booking between 30 and 7 days before the event start time and receive a 50% refund (excluding Fees) of their Booking Price. Cancellations submitted less than 7 days before the Event start time are non refundable.
      </span></div>
      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
        <Checkbox name="clause_24_hour" defaultChecked={false} onChange={(checked) => setValue("clause_24_hour", checked)} className="pr-4" /> 24 Hour Clause: Guests may cancel their Booking until 24 hours before the event start time and will receive a full refund (including all fees) of their Booking Price. Booking cancellations submitted less than 24 hours before the Event start time are non refundable.
      </span></div>


      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
        <Checkbox name="terms_conditions" defaultChecked={false} onChange={(checked) => setValue("terms_conditions", checked)} className="pr-4" /> I agree to Terms and Conditions
      </span>
      </div>

      <div className="flex justify-end space-x-5">
        <ButtonSecondary onClick={onHandleBack}>Go back</ButtonSecondary>
        <ButtonPrimary >{"Next"}</ButtonPrimary>
      </div>
    </form>
  );
};

export default PageAddListing5;
