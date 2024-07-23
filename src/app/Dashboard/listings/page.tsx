"use client";
import { ReactNode } from "react";
import Venuelisting from '@/app/Dashboard/listings/venuelisting/page';
import Poollisting from '@/app/Dashboard/listings/poollisting/page';
const Listings = () => {
  return (

    <>
     <Poollisting/>
     <Venuelisting/>
    </>
  );
};

export default Listings;
