"use client";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "@/app/add-pool-listing/FormItem";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import React, { FC, useState } from "react";
import DatePicker from "react-datepicker";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useFormState } from "@/app/add-pool-listing/FormContext";
import { useForm } from "react-hook-form";
import { PoolListing } from "@/routers/types"
import moment from "moment";

export interface PageAddListing9Props { }

const PageAddListing1: FC<PageAddListing9Props> = () => {

  type DatesState = {
    selectedDates: [Date | null, Date | null];
    dateRange: Date[];
    blockedDates: Date[];
  };

  const [AvailabilityDates, setAvailabilityDates] = useState<DatesState>({
    selectedDates: [null, null],
    dateRange: [],
    blockedDates: []
  });

  const [BlockOutDates, setBlockOutDates] = useState<DatesState>({
    selectedDates: [null, null],
    dateRange: [],
    blockedDates: []
  });


  const { onHandleNext, setFormData, formData, step } = useFormState();
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<PoolListing>({
    defaultValues: formData,
  });


  const onHandleFormSubmit = (data: PoolListing) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  };

  const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };



  const handleAvailabilityDatesChange = (dates: [Date | any, Date | any]) =>{

    debugger
    
    var NewDate: String[] = [];

    if (dates[0] && dates[1]) {
      const range = getDatesInRange(dates[0], dates[1]);

      setAvailabilityDates((prevState) => ({
        selectedDates: dates,
        dateRange: range,
        blockedDates: [...range],
      }));

      range.forEach((element: moment.MomentInput) => {
      
        if (element != null) NewDate.push(moment(element).format("YYYY-MM-DD"))
      
        });

       setValue('availability_date', NewDate.toString());
    } 
    
    else if (dates[0]) {
    
      setAvailabilityDates((prevState) => ({
        selectedDates: dates,
        dateRange:[],
        blockedDates: [dates[0]],
      }));
      setValue('availability_date', moment(dates[0]).format("YYYY-MM-DD").toString());

    }
    else { 
      setAvailabilityDates((prevState) => ({
        selectedDates: [null, null],
        dateRange: [],
        blockedDates: prevState.blockedDates,
      }));
    }
  
    clearErrors('availability_date');

  };





  const handleBlockOutDatesChange = (dates: [Date | any, Date | any]) => {

    var NewDate: String[] = [];

    debugger

    if (dates[0] && dates[1]) {
      const range = getDatesInRange(dates[0], dates[1]);

      setBlockOutDates((prevState) => ({
        selectedDates: dates,
        dateRange: range,
        blockedDates: [...range],
      }));

      range.forEach((element: moment.MomentInput) => {
      
        if (element != null) NewDate.push(moment(element).format("YYYY-MM-DD"))
      
        });

        setValue('blockout_dates', NewDate.toString());
    } 
    else if (dates[0]) {
    
      setBlockOutDates((prevState) => ({
        selectedDates: dates,
        dateRange:[],
        blockedDates: [dates[0]],
      }));
      setValue('blockout_dates', moment(dates[0]).format("YYYY-MM-DD").toString());

    }
    else {
      
      setBlockOutDates((prevState) => ({
        selectedDates: dates,
        dateRange:[],
        blockedDates: prevState.blockedDates,
      }));
    }
  
    clearErrors('blockout_dates');
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
        <h2 className="text-2xl font-semibold">List Your Pool</h2>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <FormItem label="Pool Title">
        <Input placeholder="Pool Title" {...register('pool_title', { required: 'Pool Title is required' })} />
        {errors.pool_title && <span className="text-red-600 text-sm">{errors.pool_title.message}</span>}
      </FormItem>

       <div>
        <h6 className="text-1xl font-semibold">Any dates you would like to block out(separate with comma):</h6>
        
      </div>
         <div className="addListingDatePickerExclude my-5">

          <DatePicker
            {...register('blockout_dates', { required: 'Block out date is required' })}
            onChange={handleBlockOutDatesChange}
            selected={BlockOutDates.selectedDates[0]}
            startDate={BlockOutDates.selectedDates[0]}
            endDate={BlockOutDates.selectedDates[1]}
            monthsShown={2}
            selectsRange
            showPopperArrow={false}
            excludeDates={AvailabilityDates.blockedDates.filter(Boolean).map((item: any) => new Date(item))}
            inline
            renderCustomHeader={(props) => <DatePickerCustomHeaderTwoMonth {...props} />}
            renderDayContents={(day, date) => (
              <DatePickerCustomDay dayOfMonth={day} date={date} />
            )}
          />
          {errors.blockout_dates && <span className="text-red-600 text-sm">{errors.blockout_dates.message}</span>}
        </div>


        <div>
          <h2 className="text-2xl font-semibold">Set your availability</h2>
        </div>

        <div className="addListingDatePickerExclude">
          <DatePicker
            {...register('availability_date', { required: 'Availability date is required' })}
            onChange={handleAvailabilityDatesChange}
            selected={AvailabilityDates.selectedDates[0]}
            startDate={AvailabilityDates.selectedDates[0]}
            endDate={AvailabilityDates.selectedDates[1]}
            monthsShown={2}
            selectsRange
            showPopperArrow={false}
            excludeDates={BlockOutDates.blockedDates.filter(Boolean).map((item: any) => new Date(item))}
            inline
            renderCustomHeader={(props) => <DatePickerCustomHeaderTwoMonth {...props} />}
            renderDayContents={(day, date) => (
              <DatePickerCustomDay dayOfMonth={day} date={date} />
            )}
          />
          {errors.availability_date && <span className="text-red-600 text-sm">{errors.availability_date.message}</span>}
        </div>

      
      <div className="flex justify-end space-x-5">
        <ButtonPrimary >{"Next"}</ButtonPrimary>
      </div>
    </form>

  );
};

export default PageAddListing1;
