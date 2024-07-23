"use client";
import React, { FC, Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Popover } from "@headlessui/react";
import { ArrowRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import CommentListing from "@/components/CommentListing";
import StartRating from "@/components/StartRating";
import Avatar from "@/shared/Avatar";
import Badge from "@/shared/Badge";
import ButtonCircle from "@/shared/ButtonCircle";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import ButtonClose from "@/shared/ButtonClose";
import Input from "@/shared/Input";
import LikeSaveBtns from "@/components/LikeSaveBtns";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Amenities_demos } from "../../constant";
import { Route } from "next";
import Checkbox from "@/shared/Checkbox";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePicker from "react-datepicker";
import NcInputNumber from "@/components/NcInputNumber";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import ClearDataButton from "@/app/(client-components)/(HeroSearchForm)/ClearDataButton";
import { GuestsObject } from "@/app/(client-components)/type";
import { toast } from 'react-toastify';
import moment from 'moment';
import { loadStripe } from '@stripe/stripe-js';
import { StarIcon } from "@heroicons/react/24/solid";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
export interface ListingStayDetailPageProps { }


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const ListingStayDetailPage: FC<ListingStayDetailPageProps> = ({ params }: any) => {

  let [isOpenModalAmenities, setIsOpenModalAmenities] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [Bookingloading, setBookingloading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [venueListings, setvenueListings] = useState<any[]>([]);
  const [UserReviews, setUserReviews] = useState<any[]>([]);
  const [HostInfo, setHostInfo] = useState<any[]>([]);

  const [PHOTOS, setPHOTOS] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(2);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(1);
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(1);
  const [hoursInputValue, sethoursInputValue] = useState(1);
  const [totalamountValue, settotalamountValue] = useState(0);
  const [BlockDates, setBlockDates] = useState<any>([]);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      setLoading(true);
      try {
        const [responseDetails, responseListings] = await Promise.all([
          fetch('/api/venue/venue-detail/' + params.Id),
          fetch('/api/venue_booking_listing/' + params.Id)
        ]);

        if (!responseDetails.ok) {
          throw new Error('Failed to fetch venue details');
        }
        if (!responseListings.ok) {
          throw new Error('Failed to fetch booking listings');
        }

        debugger
        const detailsData = await responseDetails.json();
        const listingsData = await responseListings.json();

        debugger

        const blockOutDatesArray = detailsData.VenueDetails[0].block_out_dates
          .split(",")
          .map((dateStr: string) => new Date(dateStr))
          .filter((date: { getTime: () => number; }) => !isNaN(date.getTime()));

        const bookingDatesArray = listingsData.bookingDates.split(",").map((dateStr: string) => new Date(dateStr))
          .filter((date: { getTime: () => number; }) => !isNaN(date.getTime()));

        setBlockDates([...blockOutDatesArray, ...bookingDatesArray]);
        setPHOTOS(detailsData.VenueDetails[0].venueimage_base64.split(","));
        settotalamountValue(Number(detailsData.VenueDetails[0].hourly_rate));
        setvenueListings(detailsData.VenueDetails);
        setUserReviews(detailsData.Reviews);
        setHostInfo(detailsData.HostInfo);

        setError(undefined);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch venue details or booking listings');
      } finally {
        setLoading(false);
      }
    };
    fetchVenueDetails();
  }, [params.Id]);

  const [currentHover, setCurrentHover] = useState(0);

  const [reviewData, setReviewData] = useState({
    venue_id: params.Id,
    listing_type: 'Venue',
    review: '',
    rating: 5,
    createdBy: user?.id,
    modifiedBy: 0,
    status: 'Pending',
  });

  useEffect(() => {
    setReviewData({ ...reviewData, rating: reviewData.rating })
  }, [reviewData.rating]);


  const thisPathname = usePathname();
  const router = useRouter();

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    let newValue = {
      guestAdults: guestAdultsInputValue,
      guestChildren: guestChildrenInputValue,
      guestInfants: guestInfantsInputValue,
    };
    if (type === "guestAdults") {
      setGuestAdultsInputValue(value);
      newValue.guestAdults = value;
    }
    if (type === "guestChildren") {
      setGuestChildrenInputValue(value);
      newValue.guestChildren = value;
    }
    if (type === "guestInfants") {
      setGuestInfantsInputValue(value);
      newValue.guestInfants = value;
    }
  };

  const totalGuests = guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue;


  const onChangeDate = (date: any) => {
    setStartDate(date);
  };

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300 dark:text-neutral-400">
          <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block xl:text-lg font-semibold">
            {startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            }) || "Add date"}
          </span>
        </div>
      </>
    );
  };

  function closeModalAmenities() {
    setIsOpenModalAmenities(false);
  }

  function openModalAmenities() {
    setIsOpenModalAmenities(true);
  }

  const AddReview = async () => {

    debugger
    console.log(reviewData);

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const result = await response.json();
    console.log(result);
  };


  const handleOpenModalImageGallery = () => {
    router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route);
  };

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge name="VANUE LISTING" />
          {/* <LikeSaveBtns /> */}
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {venueListings && venueListings[0] ? venueListings[0].title : ""}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          {venueListings && venueListings[0] &&
            <StartRating  point={Number(Number(venueListings[0].average_rating).toFixed(2))} reviewCount={venueListings[0].review_count} />
          }
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> {venueListings && venueListings[0] ? venueListings[0].city + " " + venueListings[0].state : ""}</span>
          </span>
        </div>

        {/* 4 */}
        <div className="flex items-center">
          <Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Hosted by{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              {
                HostInfo && HostInfo[0] && HostInfo[0]?.fullName || ""
              }
            </span>
          </span>
        </div>

        {/* 5 */}
        {/* <div className="w-full border-b border-neutral-100 dark:border-neutral-700" /> */}

        {/* 6 */}
        {/* <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center space-x-3 ">
            <i className=" las la-user text-2xl "></i>
            <span className="">
              6 <span className="hidden sm:inline-block">guests</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-bed text-2xl"></i>
            <span className=" ">
              6 <span className="hidden sm:inline-block">beds</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-bath text-2xl"></i>
            <span className=" ">
              3 <span className="hidden sm:inline-block">baths</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <i className=" las la-door-open text-2xl"></i>
            <span className=" ">
              2 <span className="hidden sm:inline-block">bedrooms</span>
            </span>
          </div>
        </div> */}
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Stay information</h2>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          <span>
            {venueListings && venueListings[0] ? venueListings[0].description : ""}
          </span>

        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Amenities </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {` About the property's amenities and services`}
          </span>
        </div>
        <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">

          {/* {Amenities_demos.filter((_, i) => i < 12).map((item) => (
                  <div key={item.name} className="flex items-center space-x-3">
                    <i className={`text-3xl las ${item.icon}`}></i>
                    <span className=" ">{item.name}</span>
                  </div>
                 ))} */}

          {venueListings && venueListings[0] ? <>
            <Checkbox label="Onsite Parking Free" name="onsite_parking_free" disabled defaultChecked={venueListings[0].onsite_parking_free == 1 ? true : false} />
            <Checkbox label="Onsite Parking Paid" name="onsite_parking_paid" disabled defaultChecked={venueListings[0].onsite_parking_paid == 1 ? true : false} />
            <Checkbox label="Street Parking" name="street_parking" disabled defaultChecked={venueListings[0].street_parking == 1 ? true : false} />
            <Checkbox label="Valet Service" name="valet_service" disabled defaultChecked={venueListings[0].valet_service == 1 ? true : false} />
            <Checkbox label="No Parking" name="no_parking" disabled defaultChecked={venueListings[0].no_parking == 1 ? true : false} />
            <Checkbox label="Speakers" name="speakers" disabled defaultChecked={venueListings[0].speakers == 1 ? true : false} />
            <Checkbox label="Grill" name="grill" disabled defaultChecked={venueListings[0].grill == 1 ? true : false} />
            <Checkbox label="Brick Oven" name="brick_oven" disabled defaultChecked={venueListings[0].brick_oven == 1 ? true : false} />
            <Checkbox label="Playground" name="playground" disabled defaultChecked={venueListings[0].playground == 1 ? true : false} />
            <Checkbox label="Tennis Court" name="tennis_court" disabled defaultChecked={venueListings[0].tennis_court == 1 ? true : false} />
            <Checkbox label="Volleyball Court" name="volleyball_court" disabled defaultChecked={venueListings[0].volleyball_court == 1 ? true : false} />
            <Checkbox label="Basketball Court" name="basketball_court" disabled defaultChecked={venueListings[0].basketball_court == 1 ? true : false} />
            <Checkbox label="Sauna" name="sauna" disabled defaultChecked={venueListings[0].sauna == 1 ? true : false} />
            <Checkbox label="WIFI" name="wifi" disabled defaultChecked={venueListings[0].wifi == 1 ? true : false} />
            <Checkbox label="Table & Chairs" name="table_chairs" disabled defaultChecked={venueListings[0].table_chairs == 1 ? true : false} />
          </>
            : null
          }

        </div>

        {/* <div>
          <ButtonSecondary onClick={openModalAmenities}>
            View more 20 amenities
          </ButtonSecondary>
        </div>
        {renderMotalAmenities()} */}
      </div>
    );
  };

  const renderMotalAmenities = () => {
    return (
      <Transition appear show={isOpenModalAmenities} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModalAmenities}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block py-8 h-screen w-full max-w-4xl">
                <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                  <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="headlessui-dialog-title-70"
                    >
                      Amenities
                    </h3>
                    <span className="absolute left-3 top-3">
                      <ButtonClose onClick={closeModalAmenities} />
                    </span>
                  </div>
                  <div className="px-8 overflow-auto text-neutral-700 dark:text-neutral-300 divide-y divide-neutral-200">
                    {Amenities_demos.filter((_, i) => i < 1212).map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center py-2.5 sm:py-4 lg:py-5 space-x-5 lg:space-x-8"
                      >
                        <i
                          className={`text-4xl text-neutral-6000 las ${item.icon}`}
                        ></i>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };

  const renderSection4 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Room Rates </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Prices may increase on weekends or holidays
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}
        <div className="flow-root">
          <div className="text-sm sm:text-base text-neutral-6000 dark:text-neutral-300 -mb-4">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
              <span>Monday - Thursday</span>
              <span>$199</span>
            </div>
            <div className="p-4  flex justify-between items-center space-x-4 rounded-lg">
              <span>Monday - Thursday</span>
              <span>$199</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
              <span>Friday - Sunday</span>
              <span>$219</span>
            </div>
            <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
              <span>Rent by month</span>
              <span>-8.34 %</span>
            </div>
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 flex justify-between items-center space-x-4 rounded-lg">
              <span>Minimum number of nights</span>
              <span>1 night</span>
            </div>
            <div className="p-4 flex justify-between items-center space-x-4 rounded-lg">
              <span>Max number of nights</span>
              <span>90 nights</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* host */}
        <div className="flex items-center space-x-4">
          <Avatar
            hasChecked
            hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
            sizeClass="h-14 w-14"
            radius="rounded-full"
          />
          <div>
            <a className="block text-xl font-medium" href="javascript:void(0);">
              {
                HostInfo && HostInfo[0] && HostInfo[0]?.fullName || ""
              }
            </a>
            {/* <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <StartRating />
              <span className="mx-2">·</span>
              <span> 12 places</span>
            </div> */}
          </div>
        </div>

        {/* desc */}
        <span className="block text-neutral-6000 dark:text-neutral-300">
          {
            HostInfo && HostInfo[0] && HostInfo[0]?.description || ""
          }
        </span>

        {/* info */}
        <div className="block text-neutral-500 dark:text-neutral-400 space-y-2.5">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Joined in {" "}
              {
                HostInfo && HostInfo[0] && moment(HostInfo[0]?.Join_Date).format("MMMM YYYY") || ""
              }
            </span>
          </div>
          {/* <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>Response rate - 100%</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span>Fast response - within a few hours</span>
          </div> */}
        </div>

        {/* == */}
        {/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <ButtonSecondary href="/author">See host profile</ButtonSecondary>
        </div> */}
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}

        {
          venueListings && venueListings[0] &&
          <h2 className="text-2xl font-semibold">Reviews ({venueListings[0].review_count} reviews)</h2>
        }
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Content */}
        <div className="space-y-5">
          <div className={`nc-FiveStartIconForRate flex items-center text-neutral-300 space-x-0.5`}
            data-nc-id="FiveStartIconForRate">
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <StarIcon
                  key={item}
                  className={`${reviewData.rating >= item || currentHover >= item ? "text-yellow-500" : ""
                    } w-6 h-6`}
                  onMouseEnter={() => setCurrentHover(() => item)}
                  onMouseLeave={() => setCurrentHover(() => 0)}
                  onClick={() => setReviewData({ ...reviewData, rating: item })}
                />
              );
            })}
          </div>

          <div className="relative">
            <Input
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your thoughts ..."
              onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
            />
            <ButtonCircle
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size=" w-12 h-12 "
              onClick={() => AddReview()}>
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </div>

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">

          {UserReviews && UserReviews.map((item, index) => (
            <div key={index} className="nc-CommentListing flex space-x-4 py-8" data-nc-id="CommentListing">
              <div className="pt-0.5">
                <Avatar
                  sizeClass="h-10 w-10 text-lg"
                  radius="rounded-full"
                  userName={item.fullName}
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between space-x-3">
                  <div className="flex flex-col">
                    <div className="text-sm font-semibold">
                      <span>{item.fullName}</span>
                      {/* {hasListingTitle && (
                          <>
                            <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                              {` review in `}
                            </span>
                            <a href="/">The Lounge & Bar</a>
                          </>
                        )} */}
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {moment(item.review_date).format("MMMM-DD-YYYY")}
                    </span>
                  </div>
                  <div className="flex text-yellow-500">

                    {Array.from({ length: item.rating }).map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4" />
                    ))}

                  </div>
                </div>
                <span className="block mt-3 text-neutral-600 dark:text-neutral-300">
                  {item.review}
                </span>
              </div>
            </div>
          ))}


          {/* <div className="pt-8">
            <ButtonSecondary>View more 20 reviews</ButtonSecondary>
          </div> */}
        </div>
      </div>
    );
  };

  const renderSection7 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Location</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {venueListings.length > 0 && (
              venueListings[0].Country + " " + venueListings[0].city
            )}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* MAP */}
        <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3 ring-1 ring-black/10 rounded-xl z-0">
          <div className="rounded-xl overflow-hidden z-0">
            {venueListings.length > 0 && (
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDz7rPf5wTgxQt0ZxMl4gNuxtO5Rd5H1Sk&q=${venueListings[0].latitude},${venueListings[0].longitude}`}
              ></iframe>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Things to know</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Cancellation policy</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Refund 50% of the booking value when customers cancel the room
            within 48 hours after successful booking and 14 days before the
            check-in time. <br />
            Then, cancel the room 14 days before the check-in time, get a 50%
            refund of the total amount paid (minus the service fee).
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Check-in time</h4>
          <div className="mt-3 text-neutral-500 dark:text-neutral-400 max-w-md text-sm sm:text-base">
            <div className="flex space-x-10 justify-between p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <span>Check-in</span>
              <span>08:00 am - 12:00 am</span>
            </div>
            <div className="flex space-x-10 justify-between p-3">
              <span>Check-out</span>
              <span>02:00 pm - 04:00 pm</span>
            </div>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        <div>
          <h4 className="text-lg font-semibold">Special Note</h4>
          <div className="prose sm:prose">
            <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
              <li>
                Ban and I will work together to keep the landscape and
                environment green and clean by not littering, not using
                stimulants and respecting people around.
              </li>
              <li>Do not sing karaoke past 11:30</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            ${Number(venueListings && venueListings[0] ? venueListings[0].hourly_rate : "0")}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /hourly
            </span>
          </span>
          {venueListings && venueListings[0] &&
         
           <StartRating  point={Number(Number(venueListings[0].average_rating).toFixed(2))} reviewCount={venueListings[0].review_count} />
        }
        </div>

        {/* FORM */}

        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl ">

          <Popover className={`StayDatesRangeInput z-10 relative flex flex-1 z-[11]`}>{({ open }) => (
            <>
              <Popover.Button
                className={`flex-1 flex relative p-3 items-center space-x-3 focus:outline-none ${open ? "shadow-lg" : ""
                  }`}
              >
                {renderInput()}
                {startDate && open && (
                  <ClearDataButton onClick={() => onChangeDate(null)} />
                )}
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
                <Popover.Panel className="absolute left-auto xl:-right-10 right-0 z-10 mt-3 top-full w-screen max-w-sm px-4 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-neutral-800 p-8">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => onChangeDate(date)}
                      monthsShown={2}
                      showPopperArrow={false}
                      inline
                      excludeDates={BlockDates.filter(Boolean).map((item: any) => new Date(item))}
                      renderCustomHeader={(p) => (
                        <DatePickerCustomHeaderTwoMonth {...p} />
                      )}
                      renderDayContents={(day, date) => (
                        <DatePickerCustomDay dayOfMonth={day} date={date} />
                      )}
                      dayClassName={(date) => {
                        const isDisabled = BlockDates.some((dateStr: string | number | Date) => new Date(dateStr).toDateString() === date.toDateString());
                        return isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed rounded-full flex items-center justify-center' : '';
                      }}
                    />
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
          </Popover>

          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>


          <Popover className={`flex relative flex-1`}>
            {({ open }) => (
              <>
                <div
                  className={`flex-1 flex items-center focus:outline-none rounded-b-3xl ${open ? "shadow-lg" : ""
                    }`}
                >
                  <Popover.Button
                    className={`relative z-10 flex-1 flex text-left items-center p-3 space-x-3 focus:outline-none`}
                  >
                    <div className="text-neutral-300 dark:text-neutral-400">
                      <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
                    </div>
                    <div className="flex-grow">
                      <span className="block xl:text-lg font-semibold">
                        {totalGuests || ""} Guests
                      </span>
                      <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                        {totalGuests ? "Guests" : "Add guests"}
                      </span>
                    </div>

                    {!!totalGuests && open && (
                      <ClearDataButton
                        onClick={() => {
                          setGuestAdultsInputValue(0);
                          setGuestChildrenInputValue(0);
                          setGuestInfantsInputValue(0);
                        }}
                      />
                    )}
                  </Popover.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1">
                  <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl ring-1 ring-black ring-opacity-5 ">
                    <NcInputNumber
                      className="w-full"
                      defaultValue={guestAdultsInputValue}
                      onChange={(value) => handleChangeData(value, "guestAdults")}
                      max={10}
                      min={1}
                      label="Adults"
                      desc="Ages 13 or above"
                    />
                    <NcInputNumber
                      className="w-full mt-6"
                      defaultValue={guestChildrenInputValue}
                      onChange={(value) => handleChangeData(value, "guestChildren")}
                      max={4}
                      label="Children"
                      desc="Ages 2–12"
                    />

                    <NcInputNumber
                      className="w-full mt-6"
                      defaultValue={guestInfantsInputValue}
                      onChange={(value) => handleChangeData(value, "guestInfants")}
                      max={4}
                      label="Infants"
                      desc="Ages 0–2"
                    />
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>


          <Popover className={`flex relative flex-1`}>
            {({ open }) => (
              <>
                <div
                  className={`flex-1 flex items-center focus:outline-none rounded-b-3xl ${open ? "shadow-lg" : ""
                    }`}
                >
                  <Popover.Button
                    className={`relative z-1 flex-1 flex text-left items-center p-3 space-x-3 focus:outline-none`}
                  >
                    <div className="text-neutral-300 dark:text-neutral-400">
                      <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
                    </div>
                    <div className="flex-grow">
                      <span className="block xl:text-lg font-semibold">
                        {hoursInputValue || ""} Hours
                      </span>
                      <span className="block mt-1 text-sm text-neutral-400 leading-none font-light">
                        {hoursInputValue ? "Hours" : "Add Hours"}
                      </span>
                    </div>

                    {!!hoursInputValue && open && (
                      <ClearDataButton
                        onClick={() => {
                          sethoursInputValue(1)
                        }}
                      />
                    )}
                  </Popover.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1">
                  <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[340px] max-w-sm bg-white dark:bg-neutral-800 top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl ring-1 ring-black ring-opacity-5 ">
                    <NcInputNumber
                      className="w-full"
                      defaultValue={hoursInputValue}
                      onChange={(value) => {
                        sethoursInputValue(value);
                        settotalamountValue(Number(value * totalamountValue / hoursInputValue));
                      }}
                      min={1}
                      label="Hours"
                    />
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

        </form>

        {/* SUM */}
        <div className="flex flex-col space-y-4">
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalamountValue}</span>
          </div>
        </div>

        {/* SUBMIT */}
        <ButtonPrimary disabled={Bookingloading} type="button" onClick={() => CreateBooking()}>{Bookingloading ? "Loading..." : "Booking"}</ButtonPrimary>
      </div>
    );
  };


  const CreateBooking = async () => {

    const booking = {
      TotalAdults: guestAdultsInputValue,
      TotalChildren: guestChildrenInputValue,
      TotalInfants: guestInfantsInputValue,
      TotalHours: hoursInputValue,
      ListingType: 'Venue',
      StoreListingID: venueListings[0].id,
      TotalAmount: totalamountValue,
      TotalGuest: totalGuests,
      BookingDate: moment(startDate).format("YYYY-MM-DD"),
      CreatedBookingUserID:user?.id
    };

    try {

      setBookingloading(true);
      const response = await fetch('/api/venue_booking_listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const result = await response.json();

      CreatePayment(result.BookingId);

    } catch (error: any) {
      setBookingloading(false);
      toast.error(error.message as string);
    }
  }

  const CreatePayment = async (Id: any) => {

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(totalamountValue),
          currency: 'usd',
          description: venueListings && venueListings[0] ? venueListings[0].title : "",
          bookingId: Number(Id),
          Booking_Listing_type: "VENUE LISTING",
          CreatedBy:user?.id
        }),
      });

      if (!res.ok) {

        throw new Error(`Network response was not ok: ${res.statusText}`);
      }
      const { sessionId } = await res.json();

      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }
      await stripe.redirectToCheckout({ sessionId });

    } catch (error: any) {
      toast.error(error.message as string);
    } finally {
      setBookingloading(false);
    }
  };


  if (loading) {

    return (<div className="flex justify-center mt-5 items-center" style={{ height: "25vh" }}>
      <div role="status">
        <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>);

  }

  if (error) {
    return (
      <div>
        {error && <p>{error}</p>}
      </div>
    );
  }


  return (
    <div className="nc-ListingStayDetailPage">
      {/*  HEADER */}

      <header className="rounded-md sm:rounded-xl">
        <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
          <div
            className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
            onClick={handleOpenModalImageGallery}
          >
            <Image
              fill
              className="object-cover rounded-md sm:rounded-xl"
              src={venueListings && venueListings[0] ? venueListings[0].venue_cover_image_base64 : ""}
              alt=""
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            />
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>

          {PHOTOS.filter((_, i) => i >= 0 && i < 4).map((item, index) => (
            <div
              key={index}
              className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 3 ? "hidden sm:block" : ""
                }`}
            >
              <div className="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5">
                <Image
                  fill
                  className="object-cover rounded-md sm:rounded-xl "
                  src={item || ""}
                  alt=""
                  sizes="400px"
                />
              </div>

              {/* OVERLAY */}
              <div
                className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleOpenModalImageGallery}
              />
            </div>
          ))}

          <button
            className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-200 z-10"
            onClick={handleOpenModalImageGallery}
          >
            <Squares2X2Icon className="w-5 h-5" />
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Show all photos
            </span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className=" relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pr-10">
          {renderSection1()}
          {renderSection2()}
          {renderSection3()}
          {/* {renderSection4()} */}
          {/* <SectionDateRange /> */}
          {renderSection5()}
          {renderSection6()}
          {renderSection7()}
          {/* {renderSection8()} */}
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-28">{renderSidebar()}</div>
        </div>
      </main>
    </div>
  );
};

export default ListingStayDetailPage;
