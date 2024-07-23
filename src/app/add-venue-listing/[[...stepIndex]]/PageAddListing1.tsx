"use client";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "@/app/add-venue-listing/FormItem";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import React, { FC, useState } from "react";
import DatePicker from "react-datepicker";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { useFormState, } from "@/app/add-venue-listing/FormContext";
import { useForm } from "react-hook-form";
import { VenueSpace } from "@/routers/types"
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
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<VenueSpace>({
    defaultValues: formData,
  });


  const onHandleFormSubmit = (data: VenueSpace) => {
    
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setValue('venue_type', value); // Update the value in the form state
    if (value) {
      clearErrors('venue_type'); // Clear errors if a valid option is selected
    }
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

        setValue('block_out_dates', NewDate.toString());
    } 
    else if (dates[0]) {
    
      setBlockOutDates((prevState) => ({
        selectedDates: dates,
        dateRange:[],
        blockedDates: [dates[0]],
      }));
      setValue('block_out_dates', moment(dates[0]).format("YYYY-MM-DD").toString());

    }
    else {
      
      setBlockOutDates((prevState) => ({
        selectedDates: dates,
        dateRange:[],
        blockedDates: prevState.blockedDates,
      }));
    }
  
    clearErrors('block_out_dates');
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
        <h2 className="text-2xl font-semibold">List Your Venue Space</h2>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

      <FormItem label="Venue Space Title*" desc="A catchy name usually includes: House name + Room name + Featured property + Tourist destination">
        <Input placeholder="Places name" {...register('title', { required: 'Title is required' })} />
        {errors.title && <span className="text-red-600 text-sm">{errors.title.message}</span>}
      </FormItem>

      <FormItem label="Choose a venue type">
        <Select
          {...register('venue_type', { required: 'Venue type is required' })}
          onChange={(e) => {
            handleChange(e);
            register('venue_type').onChange(e);
          }}
          defaultValue=""
        >
          <option value="" disabled hidden>Select a venue type</option> {/* Use hidden instead of disabled for clarity */}
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

        {errors.venue_type && <span className="text-red-600 text-sm">{errors.venue_type.message}</span>}
      </FormItem>

      <div>
        <h6 className="text-1xl font-semibold">Any dates you would like to Block out:</h6>
        
      </div>
         <div className="addListingDatePickerExclude my-5">

          <DatePicker
            {...register('block_out_dates', { required: 'Block out dates is required' })}
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
          {errors.block_out_dates && <span className="text-red-600 text-sm">{errors.block_out_dates.message}</span>}
        </div>

      <div>
        <h2 className="text-1xl font-semibold">Set your availability</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Editing your calendar is easy—just select a date to block or unblock
          it. You can always make changes after you publish.
        </span>
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
