"use client";
import { MapPinIcon } from "@heroicons/react/24/solid";
import LocationMarker from "@/components/AnyReactComponent/LocationMarker";
import Label from "@/components/Label";
import GoogleMapReact from "google-map-react";
import React, { FC,useState } from "react";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "@/app/add-venue-listing/FormItem";
import { useFormState } from "@/app/add-venue-listing/FormContext";
import { useForm } from "react-hook-form";
import { VenueSpace } from "@/routers/types"
import { Autocomplete } from '@react-google-maps/api';

export interface PageAddListing2Props { }

const PageAddListing2: FC<PageAddListing2Props> = () => {

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { onHandleNext, setFormData, onHandleBack, formData, step } = useFormState();
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<VenueSpace>({
    defaultValues: formData,
  });

  const onHandleFormSubmit = (data: VenueSpace) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    onHandleNext();
  };


  const onLoad = (autoComplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autoComplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const { lat, lng } = place.geometry.location.toJSON();
        const city = place.address_components?.find(component => component.types.includes('locality'))?.long_name || '';
        const state = place.address_components?.find(component => component.types.includes('administrative_area_level_1'))?.short_name || '';
        const country = place.address_components?.find(component => component.types.includes('country'))?.long_name || '';
        const postalCode = place.address_components?.find(component => component.types.includes('postal_code'))?.long_name || '';

        setValue("city",city);
        setValue("Country",country);
        setValue("state",state);
        setValue("latitude",lat.toString());
        setValue("longitude",lng.toString());
        setValue("zip_code",postalCode);
        
      } else {
        console.log('No place details available');
      }
    }
  }

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

      <h2 className="text-2xl font-semibold">Your place location</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
         <FormItem label="Space Address" desc="Your space's address remains confidential and will not be visible to the public on your listing. Only after a guest has booked the space will they be given access to the address.*">
          <Input placeholder="Enter The Adress ( Excluded city,state and zip code )" {...register('space_address', { required: 'Space address is required' })} />
          {errors.space_address && <span  className="text-red-600 text-sm">{errors.space_address.message}</span>}
        </FormItem>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            fields: ['address_components', 'geometry'],
            types: ['geocode'],
          }}
        >
           <FormItem label="Search for a place">
           <Input type="text" placeholder="Search for a place" {...register('place', { required: 'Search place is required' })} />
           {errors.place && <span  className="text-red-600 text-sm">{errors.place.message}</span>}
          </FormItem>
       
         </Autocomplete>
        <FormItem label="Phone Number">
          <Input placeholder="Type Your Phone Number" {...register('phone_number', { required: 'Phone number is required' })} />
          {errors.phone_number && <span  className="text-red-600 text-sm">{errors.phone_number.message}</span>}
        </FormItem>

        <FormItem label="Country">
          <Input  placeholder="Type Your Country" {...register('Country', { required: 'Country is required' })} />
          {errors.Country && <span  className="text-red-600 text-sm">{errors.Country.message}</span>}
        </FormItem>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
          <FormItem label="City*">
            <Input  placeholder="Type Your City" {...register('city', { required: 'City is required' })} />
            {errors.city && <span  className="text-red-600 text-sm">{errors.city.message}</span>}
          </FormItem>
          <FormItem label="State*">
            <Input  placeholder="Type Your State" {...register('state', { required: 'State is required' })} />
            {errors.state && <span  className="text-red-600 text-sm">{errors.state.message}</span>}
          </FormItem>
          <FormItem label="Zip code*">
            <Input  placeholder="Type Your Zip code" {...register('zip_code', { required: 'Zip code is required' })} />
            {errors.zip_code && <span  className="text-red-600 text-sm">{errors.zip_code.message}</span>}
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

export default PageAddListing2;
