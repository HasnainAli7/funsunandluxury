"use client";
import React, { FC, useEffect, useState } from 'react';
import GallerySlider from "@/components/GallerySlider";
import { StayDataType } from "@/data/types";
import StartRating from "@/components/StartRating";
import SaleOffBadge from "@/components/SaleOffBadge";
import Link from "next/link";

export interface StayCard2Props {
  className?: string;
  data?: StayDataType;
  size?: "default" | "small";
}

const StayCard2: FC<StayCard2Props> = ({ size = "default", className = "" }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [venueListings, setVenueListings] = useState<any[]>([]);
  const [poolListings, setPoolListings] = useState<any[]>([]);
  const [venueError, setVenueError] = useState<string | undefined>(undefined);
  const [poolError, setPoolError] = useState<string | undefined>(undefined);

  debugger
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [venueResponse, poolResponse] = await Promise.all([
          fetch('/api/venue'),
          fetch('/api/pool'),
        ]);

        if (!venueResponse.ok) {
          throw new Error('Failed to fetch Venue listings');
        }
        if (!poolResponse.ok) {
          throw new Error('Failed to fetch Pool listings');
        }

        const [venueData, poolData] = await Promise.all([
          venueResponse.json(),
          poolResponse.json(),
        ]);

        setVenueListings(venueData);
        setPoolListings(poolData);
        setVenueError(undefined);
        setPoolError(undefined);
      } catch (error: any) {
        if (error.message.includes('Venue')) {
          setVenueError(error.message);
        } else if (error.message.includes('Pool')) {
          setPoolError(error.message);
        } else {
          setVenueError('Failed to fetch Venue listings');
          setPoolError('Failed to fetch Pool listings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ position: "absolute", left: 0, right: 0 }} >
        <div role="status">
          <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (venueError || poolError) {
    return (
      <div>
        {venueError && <p>{venueError}</p>}
        {poolError && <p>{poolError}</p>}
      </div>
    );
  }

  return (
    <>
      {venueListings && venueListings.length > 0 &&
        venueListings.map((item, index) => (
          <div key={`venue-${index}`} className={`nc-StayCard2 group relative ${className}`}>
            <div className="relative w-full">
              <GallerySlider
                uniqueID={`StayCard2_${index}`}
                ratioClass="aspect-w-12 aspect-h-11"
                galleryImgs={item.venueimage_base64.split(",")}
                imageClass="rounded-lg"
                href={`/listing-stay-detail/venue/${item.id}`}
              />
              <SaleOffBadge desc="VENUE LISTING" className="absolute left-3 top-3" />
            </div>
            <Link href={`/listing-stay-detail/venue/${item.id}`} key={`venue-link-${index}`}>
              <div className={size === "default" ? "mt-3 space-y-3" : "mt-2 space-y-2"}>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold capitalize text-neutral-900 dark:text-white text-base">
                        <span className="line-clamp-1">{item.title}</span>
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
                      <span>{item.city + " " + item.state}</span>
                    </div>
                  </div>
                  <div className="w-14 border-b border-neutral-100 dark:border-neutral-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">
                      ${Number(item.hourly_rate)}{" "}
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
        ))
      }

      {poolListings && poolListings.length > 0 &&
        poolListings.map((item, index) => (
          <div key={`pool-${index}`} className={`nc-StayCard2 group relative ${className}`}>
            <div className="relative w-full">
              <GallerySlider
                uniqueID={`StayCard2_${index}`}
                ratioClass="aspect-w-12 aspect-h-11"
                galleryImgs={item.pool_images.split(",")}
                imageClass="rounded-lg"
                href={`/listing-stay-detail/pool/${item.id}`}
              />
              <SaleOffBadge desc="POOL LISTING" className="absolute left-3 top-3" />
            </div>
            <Link href={`/listing-stay-detail/pool/${item.id}`} key={`pool-link-${index}`}>
              <div className={size === "default" ? "mt-3 space-y-3" : "mt-2 space-y-2"}>
                <div className="mt-3 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold capitalize text-neutral-900 dark:text-white text-base">
                        <span className="line-clamp-1">{item.title}</span>
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
                      <span>{item.city + " " + item.state}</span>
                    </div>
                  </div>
                  <div className="w-14 border-b border-neutral-100 dark:border-neutral-800" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold">
                      ${Number(item.guest_rate_1_5)}{" "}
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
        ))
      }
    </>
  );
};

export default StayCard2;
