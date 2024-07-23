"use client";
import React, { FC, ReactNode,SetStateAction,useState } from "react";
import { FaCircle, FaTimes, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import '@/styles/bootstrap.min.css'; 
import { RootState } from '@/store/store';
export interface CommonLayoutProps {
    children?: React.ReactNode;
  }
  
  const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
      
    const user = useSelector((state: RootState) => state.auth.user);

    return (
      console.log(user),
    <div className="flex"style={{height:"auto"}}>
      <div style={{height:"auto"}} className={`fixed lg:relative w-64 z-50 bg-black text-white transition-transform transform lg:translate-x-0`}>
        <div className="pl-3">
          <h1 className='text-2xl pt-5 pb-3'>Dashboard</h1>
        </div>
        <ul className="mt-4">
        {
          user && 
          user.roles.includes("User")  &&
          <Link href={"/Dashboard"}>
          <li className={`p-3 cursor-pointer bg-white text-black`} >
            <FaCircle className="inline-block mr-2" />My Listing
          </li>
          </Link>
        }
          
          <Link href={"/Dashboard/Messages"}>
          <li className={`p-3 mt-3 cursor-pointer bg-white text-black`} >
            <FaCircle className="inline-block mr-2" />Messages
          </li>
          </Link>

          {
          user && 
          user.roles.includes("Admin")  &&<>
          <Link href={"/Dashboard/booking"}>
          <li className={`p-3 mt-3 cursor-pointer bg-white text-black`} >
            <FaCircle className="inline-block mr-2" />Bookings
          </li>
          </Link>
        
          <Link href={"/Dashboard/listings"}>
          <li className={`p-3 mt-3 cursor-pointer bg-white text-black`} >
            <FaCircle className="inline-block mr-2" />Listings
          </li>
          </Link>
          </>
           }
        </ul>
      </div>

        <div className="flex-1 p-2 my-3">
         {children}
      </div>
    </div>
  );
};

export default CommonLayout;
