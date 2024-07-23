"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useThemeMode } from "@/utils/useThemeMode";
// import { useDispatch } from 'react-redux';
// import { loginUser } from '@/store/slices/authSlice';
// import Cookies from 'js-cookie'; 
const ClientCommons = () => {
  //
  useThemeMode();

  // const dispatch = useDispatch();

  const pathname = usePathname();
  //  CUSTOM THEME STYLE
  useEffect(() => {

  //  const token = Cookies.get('token');  // Get token using js-cookie
    
  //   if (token) {

  //     dispatch(loginUser(token));
   
  //   }

    const $body = document.querySelector("body");
    if (!$body) return;

    let newBodyClass = "";

    if (pathname === "/home-3") {
      newBodyClass = "theme-purple-blueGrey";
    }
    if (pathname === "/home-2") {
      newBodyClass = "theme-cyan-blueGrey";
    }

    newBodyClass && $body.classList.add(newBodyClass);
    return () => {
      newBodyClass && $body.classList.remove(newBodyClass);
    };
  }, [pathname]);

  return <></>;
};

export default ClientCommons;
