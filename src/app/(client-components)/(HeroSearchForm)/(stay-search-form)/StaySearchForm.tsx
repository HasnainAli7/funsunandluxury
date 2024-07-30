"use client";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, FC } from "react";
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import ClearDataButton from "@/app/ClientCommons";
import LocationInput from "../LocationInput";
import SearchButton from "../SearchButton";
import StayDatesRangeInput from "./StayDatesRangeInput";
export interface LocationInputProps {
  placeHolder?: string;
  desc?: string;
  className?: string;
  divHideVerticalLineClass?: string;
  autoFocus?: boolean;
}

const StaySearchForm: FC<LocationInputProps> = ({
  autoFocus = false,
  placeHolder = "Location",
  desc = "Where are you going?",
  className = "nc-flex-1.5",
  divHideVerticalLineClass = "left-10 -right-0.5",
}) => {
  const [value, setValue] = useState("");

  const { isLoaded, loadError } = useLoadScript({googleMapsApiKey:"AIzaSyDz7rPf5wTgxQt0ZxMl4gNuxtO5Rd5H1Sk",libraries: ["places"]});

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autoComplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autoComplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place.geometry) {
        const country = place.address_components?.find(component => component.types.includes('country'))?.long_name || '';
        setValue(country);
      } else {
        console.log('No place details available');
      }
    }
  }


  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    
    <form className="w-full relative mt-8 flex rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800">

      <div className={`relative flex ${className}`}>
        <div className={`flex z-10 flex-1 relative [ nc-hero-field-padding ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left`}>
          <div className="text-neutral-300 dark:text-neutral-400">
            <MapPinIcon className="w-5 h-5 lg:w-7 lg:h-7" />
          </div>
          <div className="flex-grow">
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                fields: ['address_components', 'geometry'],
                types: ['geocode'],
              }}
            >
              <input
                className={`block w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-300 xl:text-lg font-semibold placeholder-neutral-800 dark:placeholder-neutral-200 truncate`}
                placeholder={placeHolder}
              />
            </Autocomplete>
            <span className="block mt-0.5 text-sm text-neutral-400 font-light">
              <span className="line-clamp-1">{!!value ? placeHolder : desc}</span>
            </span>
          </div>
        </div>
      </div>
      <SearchButton className="flex-1" buttonSubmitHref={`/listing-stay-map?Country=${value}`} />   
    </form>
  );
};

export default StaySearchForm;
