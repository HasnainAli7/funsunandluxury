"use client";
import React, { FC,Fragment, useEffect, useState } from "react";
import AnyReactComponent from "@/components/AnyReactComponent/AnyReactComponent";
import GoogleMapReact from "google-map-react";
import { DEMO_STAY_LISTINGS } from "@/data/listings";
import ButtonClose from "@/shared/ButtonClose";
import Pagination from "@/shared/Pagination";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import StayCard2 from "@/components/StayCard2";
import GallerySlider from "@/components/GallerySlider";
import { StayDataType } from "@/data/types";
import StartRating from "@/components/StartRating";
import SaleOffBadge from "@/components/SaleOffBadge";
import Link from "next/link";
import { Dialog, Popover, Transition } from "@headlessui/react";
import NcInputNumber from "@/components/NcInputNumber";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonThird from "@/shared/ButtonThird";
import Slider from "rc-slider";
import convertNumbThousand from "@/utils/convertNumbThousand";
import { useForm, Controller } from "react-hook-form";
import Checkbox from "@/shared/Checkbox";
import axios from "axios";
export interface StayCard2Props {
  className?: string;
  data?: StayDataType;
  size?: "default" | "small";
}
const DEMO_STAYS = DEMO_STAY_LISTINGS.filter((_, i) => i < 12);
export interface SectionGridHasMapProps { }

const SectionGridHasMap: FC<SectionGridHasMapProps> = () => {
    

  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ListingData, setListingData] = useState<any[]>([]);
  const [Errors, setErrors] = useState<string | undefined>(undefined);
  const [isOpenMoreFilter, setisOpenMoreFilter] = useState(false);
  const [isOpenMoreFilterMobile, setisOpenMoreFilterMobile] = useState(false);
  const [rangePrices, setRangePrices] = useState([0, 0]);

  const closeModalMoreFilter = () => setisOpenMoreFilter(false);
  const openModalMoreFilter = () => setisOpenMoreFilter(true);

  const closeModalMoreFilterMobile = () => setisOpenMoreFilterMobile(false);
  const openModalMoreFilterMobile = () => setisOpenMoreFilterMobile(true);

const { control, handleSubmit,setValue } = useForm<any>({
  defaultValues: {
    Venue:false,
    Pool:false,
    rangePrices:[],
    onsite_parking_free: false,
    onsite_parking_paid: false,
    street_parking: false,
    restrooms_residence: false,
    restrooms_portable: false,
    restrooms_private: false,
    restrooms_offsite: false,
    entertainment_alcohol: false,
    entertainment_smoking: false,
    entertainment_parties: false,
    parking_lot: false,
    valet_service: false,
    no_parking: false,
    speakers: false,
    grill: false,
    brick_oven: false,
    playground: false,
    tennis_court: false,
    volleyball_court: false,
    basketball_court: false,
    sauna: false,
    wifi: false,
    table_chairs: false,
    Country:""
  }
});


const onSubmit = (data: any) =>FetchListings(data);


useEffect(() => {

  const searchParams = new URLSearchParams(window.location.search);
  
  const country = searchParams.get('Country') || "";

  var obj = country!=""?{ Country: country }:[];

  FetchListings(obj);

}, []);

  const FetchListings = async (data:any) => {

    const searchParams = new URLSearchParams(window.location.search);
  
    const country = searchParams.get('Country') || "";

    setValue("Country",country);

    setLoading(true);
    try {
      const response = await axios.post('/api/venue_pool_filtering', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setListingData(response.data);
      setErrors(undefined);
    } catch (error: any) {
      setErrors(error?.response?.data?.message || error?.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const renderXClear = () => {
    return (
      <span className="w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center ml-3 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  };

  const renderTabsTypeOfPlace = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-6000 focus:outline-none ${
                open ? "!border-primary-500 " : ""
              }`}
            >
             <span>Type of place</span>
              <i className="las la-angle-down ml-2"></i>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-5">
        
                    
                      <Controller
                      control={control}
                      rules={{
                      required: false,
                      }}
                      render={({ field: { onChange, onBlur,value } }) => (
                        <Checkbox label={"Venue"}  
                          onChange={onChange}
                          name="Venue"
                          defaultChecked={value}
                        />
                      )}
                      name="Venue"
                    />

                      <Controller
                      control={control}
                      rules={{
                      required: false,
                      }}
                      render={({ field: { onChange, onBlur,value } }) => (
                        <Checkbox label={"Pool"}  
                          onChange={onChange}
                          name="Pool"
                        
                          defaultChecked={value}
                        />
                      )}
                      name="Pool"
                    />
                               
                   
                  </div>
                  <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird onClick={close} sizeClass="px-4 py-2 sm:px-5">
                      Clear
                    </ButtonThird>
                    
                    <ButtonPrimary
                      onClick={() => {
                        close();
                        handleSubmit(onSubmit)();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderTabsPriceRage = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none `}
            >
              <span style={{color: "#000"}}>
                {`$${convertNumbThousand(
                  rangePrices[0]
                )} - $${convertNumbThousand(rangePrices[1])}`}{" "}
              </span>
              {renderXClear()}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 ">
                <div className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                  <div className="relative flex flex-col px-5 py-6 space-y-8">
                    <div className="space-y-5">
                      <span className="font-medium">Price per day</span>
                    

                       <Controller
                        control={control}
                        rules={{
                        required: false,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Slider
                          range
                          className="text-red-400"
                          min={0}
                          max={2000}
                          defaultValue={[rangePrices[0], rangePrices[1]]}
                          allowCross={false}
                          onBlur={onBlur}
                          onChange={(e) => {
                            onChange(e as number[]);
                            setRangePrices(e as number[]);
                            }}
                            
                          />
                        )}
                        name="rangePrices"
                      />
                    </div>

                    <div className="flex justify-between space-x-5">
                      <div>
                        <label
                          htmlFor="minPrice"
                          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          Min price
                        </label>
                        <div className="mt-1 relative rounded-md">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">
                              $
                            </span>
                          </div>
                          <input
                            type="text"
                            name="minPrice"
                            disabled
                            id="minPrice"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                            value={rangePrices[0]}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="maxPrice"
                          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                        >
                          Max price
                        </label>
                        <div className="mt-1 relative rounded-md">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">
                              $
                            </span>
                          </div>
                          <input
                            type="text"
                            disabled
                            name="maxPrice"
                            id="maxPrice"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-neutral-200 rounded-full text-neutral-900"
                            value={rangePrices[1]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird onClick={close} sizeClass="px-4 py-2 sm:px-5">
                      Clear
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={() => {
                        close();
                        handleSubmit(onSubmit)();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderMoreFilterItem = () => {

    return (
      <div className="space-y-5">
    
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: 'Onsite Parking Free', name: 'onsite_parking_free' },
          { label: 'Onsite Parking Paid', name: 'onsite_parking_paid' },
          { label: 'Street Parking', name: 'street_parking' },
          { label: 'Parking Lot', name: 'parking_lot' },
          { label: 'Valet Service', name: 'valet_service' },
          { label: 'No Parking', name: 'no_parking' },
          { label: 'Alcohol', name: 'entertainment_alcohol' },
          { label: 'Smoking', name: 'entertainment_smoking' },
          { label: 'Parties', name: 'entertainment_parties' },
          { label: 'Speakers', name: 'speakers' },
          { label: 'Grill', name: 'grill' },
          { label: 'Brick Oven', name: 'brick_oven' },
          { label: 'Playground', name: 'playground' },
          { label: 'Tennis Court', name: 'tennis_court' },
          { label: 'Volleyball Court', name: 'volleyball_court' },
          { label: 'Basketball Court', name: 'basketball_court' },
          { label: 'Sauna', name: 'sauna' },
          { label: 'WIFI', name: 'wifi' },
          { label: 'Table & Chairs', name: 'table_chairs' },
          { label: 'Residence Bath', name: 'restrooms_residence' },
          { label: 'Portable Restroom', name: 'restrooms_portable' },
          { label: 'Private Restroom', name: 'restrooms_private' },
          { label: 'Offsite Restroom', name: 'restrooms_offsite' },
        ].map(({ label, name }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
              <Checkbox
                label={label}
                name={name}
                defaultChecked={!!value}
                onChange={(e:any) => onChange(e)}
              />
            )}
          />
        ))}
      </div>

    </div>
    );
  };

  const renderTabMoreFilter = () => {
    return (
      <div>
        <div
          className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border border-primary-500 bg-primary-50 text-primary-700 focus:outline-none cursor-pointer`}
          onClick={openModalMoreFilter}
        >
          <span style={{color: "#000"}}>More filters</span>
          {renderXClear()}
        </div>

        <Transition appear show={isOpenMoreFilter} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModalMoreFilter}
          >
            <div className="min-h-screen text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                className="inline-block py-8 px-2 h-screen w-full max-w-4xl"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-flex flex-col w-full max-w-4xl text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      More filters
                    </Dialog.Title>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalMoreFilter} />
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto">
                    <div className="px-10 divide-y divide-neutral-200 dark:divide-neutral-800">
                      <div className="py-7">
                        <h3 className="text-xl font-medium">Amenities</h3>
                        <div className="mt-6 relative ">
                          {renderMoreFilterItem()}
                        </div>
                      </div>
                     
                    </div>
                  </div>

                  <div className="p-6 flex-shrink-0 bg-neutral-50 dark:bg-neutral-900 dark:border-t dark:border-neutral-800 flex items-center justify-between">
                    <ButtonThird
                      onClick={closeModalMoreFilter}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Clear
                    </ButtonThird>
                    <ButtonPrimary
                      onClick={() => {
                        closeModalMoreFilter();
                        handleSubmit(onSubmit)();
                      }}
                      sizeClass="px-4 py-2 sm:px-5"
                    >
                      Apply
                    </ButtonPrimary>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };


  if (loading) {

    return (<div className="flex justify-center mt-5 items-center">
      <div role="status">
        <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>);

  }

  if (Errors) {
    return (
      <div>
        {Errors && <p>{Errors}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className="min-h-screen w-full xl:w-[60%] 2xl:w-[60%] max-w-[1184px] flex-shrink-0 xl:px-8">
          {/* <Heading2 className="!mb-8" /> */}
          <div className="mb-8 lg:mb-11">
          <div className="flex lg:space-x-4">
            <div className="hidden lg:flex space-x-4">
              {renderTabsTypeOfPlace()}
              {renderTabsPriceRage()}
              {renderTabMoreFilter()}
            </div>
          </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 2xl:gap-x-6 gap-y-8">
            {
              ListingData&& ListingData.length >0?
              ListingData.map((item, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setCurrentHoverID((_) => item.id)}
                  onMouseLeave={() => setCurrentHoverID((_) => -1)}>
                  <div className={`nc-StayCard2 group relative`}>
                    <div className="relative w-full">
                      <GallerySlider
                        uniqueID={`StayCard2_${index}`}
                        ratioClass="aspect-w-12 aspect-h-11"
                        galleryImgs={item.Images.split(",")}
                        imageClass="rounded-lg"
                        href={`/listing-stay-detail/venue/${item.id}`}
                      />
                      {<SaleOffBadge desc={item.ListingType} className="absolute left-3 top-3" />}
                    </div>
                    <Link href={`listing-stay-detail/venue/${item.id}`}>
                      <div className={"default" === "default" ? "mt-3 space-y-3" : "mt-2 space-y-2"}>
                        <div className="mt-3 space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">

                              <h2 className="font-semibold capitalize text-neutral-900 dark:text-white text-base">
                                <span className="line-clamp-1">{item.Title}</span>
                              </h2>
                            </div>
                            <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-1.5">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="">{item.city + " " + item.location}</span>
                            </div>
                          </div>
                          <div className="w-14 border-b border-neutral-100 dark:border-neutral-800" />
                          <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">
                              ${Number(item.Price)}{" "}
                              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                                /hourly
                              </span>
                            </span>
                            <StartRating />
                          </div>
                        </div>

                      </div>
                    </Link>
                  </div>
                </div>
              ))
             :null

            }

          </div>

          {/* <div className="flex mt-16 justify-center items-center">
            <Pagination />
          </div> */}
        </div>

        {!showFullMapFixed && (
          <div
            className={`flex xl:hidden items-center justify-center fixed bottom-16 md:bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-neutral-900 text-white shadow-2xl rounded-full z-30  space-x-3 text-sm cursor-pointer`}
            onClick={() => setShowFullMapFixed(true)}
          >
            <i className="text-lg las la-map"></i>
            <span>Show map</span>
          </div>
        )}

        {/* MAPPPPP */}
        <div
          className={`xl:flex-1 xl:static xl:block ${
            showFullMapFixed ? "fixed inset-0 z-50" : "hidden"
          }`}
        >
          {showFullMapFixed && (
            <ButtonClose
              onClick={() => setShowFullMapFixed(false)}
              className="bg-white absolute z-50 left-3 top-3 shadow-lg rounded-xl w-10 h-10"
            />
          )}

          <div className="fixed xl:sticky top-0 xl:top-[88px] left-0 w-full h-full xl:h-[calc(100vh-88px)] rounded-md overflow-hidden">
            <div className="absolute bottom-5 left-3 lg:bottom-auto lg:top-2.5 lg:left-1/2 transform lg:-translate-x-1/2 py-2 px-4 bg-white dark:bg-neutral-800 shadow-xl z-10 rounded-2xl min-w-max">
              <Checkbox
                className="text-xs xl:text-sm"
                name="xx"
                label="Search as I move the map"
              />
            </div>
            {ListingData&& ListingData.length>0?(
            <GoogleMapReact
              defaultZoom={12}
              defaultCenter={{lat:Number(ListingData[0].latitude),lng:Number(ListingData[0].longitude)}}
              bootstrapURLKeys={{
                key: "AIzaSyDz7rPf5wTgxQt0ZxMl4gNuxtO5Rd5H1Sk",
              }}
              yesIWantToUseGoogleMapApiInternals
             >
              {ListingData.map((item,index) => (
                <AnyReactComponent
                  isSelected={currentHoverID === item.id}
                  key={index}
                  lat={Number(item.latitude)}
                  lng={Number(item.longitude)}
                  listing={item}
                />
              ))}
            </GoogleMapReact>
            ):<></>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionGridHasMap;
