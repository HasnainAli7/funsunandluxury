import React, { FC } from "react";
import Textarea from "@/shared/Textarea";
import Checkbox from "@/shared/Checkbox";
import { useFormState } from "@/app/add-venue-listing/FormContext";
import { useForm } from "react-hook-form";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { VenueSpace } from "@/routers/types"
export interface PageAddListing6Props { }

const PageAddListing5: FC<PageAddListing6Props> = () => {

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
        <h2 className="text-2xl font-semibold">
          Your place description for client
        </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Mention the best features of your accommodation, any special amenities
          like fast Wi-Fi or parking, as well as things you like about the
          neighborhood.
        </span>
      </div>

      <Textarea placeholder="..." rows={14} {...register('description', { required: 'Description is required' })} />
      {errors.description && <span className="text-red-600 text-sm">{errors.description.message}</span>}

      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">

        <Checkbox name="flexible_clause" defaultChecked={false} onChange={(checked) => setValue("flexible_clause", checked)} className="pr-4" /> Flexible Clause: Guest can Cancel Booking until 7 days before the event start time and will receive full reimbursement (including all fees) of their Booking Price.
      </span></div>
      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
        <Checkbox name="thirty_day_clause" defaultChecked={false} onChange={(checked) => setValue("thirty_day_clause", checked)} className="pr-4" />   30 Day Clause: Guests may cancel their Booking until 30 days before the event start time and will receive a full reimbursement (including all Fees) of their Booking Price. Guests may cancel their Booking between 30 and 7 days before the event start time and receive a 50% refund (excluding Fees) of their Booking Price. Cancellations submitted less than 7 days before the Event start time are non refundable.
      </span></div>
      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
        <Checkbox name="twenty_four_hour_clause" defaultChecked={false} onChange={(checked) => setValue("twenty_four_hour_clause", checked)} className="pr-4" /> 24 Hour Clause: Guests may cancel their Booking until 24 hours before the event start time and will receive a full refund (including all fees) of their Booking Price. Booking cancellations submitted less than 24 hours before the Event start time are non refundable.
      </span></div>


      <div><span className="block mt-2 text-neutral-500 dark:text-neutral-400 flex">
        <Checkbox name="terms_agreement" defaultChecked={false} onChange={(checked) => setValue("terms_agreement", checked)} className="pr-4" /> I agree to Terms and Conditions
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
