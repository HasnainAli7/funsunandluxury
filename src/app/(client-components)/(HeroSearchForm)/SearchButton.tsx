"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { FC } from "react";
import ButtonSubmit from "./ButtonSubmit";
import { PathName } from "@/routers/types";



export interface SearchButtonProps {
  fieldClassName?: string;
  className?: string;
  buttonSubmitHref?: PathName;
  hasButtonSubmit?: boolean;
}
const SearchButton: FC<SearchButtonProps> = ({
  fieldClassName = "[ nc-hero-field-padding ]",
  className = "[ nc-flex-1 ]",
  buttonSubmitHref = "/listing-stay-map",
  hasButtonSubmit = true,
}) => {
  return (
    <Popover className={`flex relative ${className}`}>
      {({ open }) => (
        <>
          <div
            className={`flex-1 z-10 flex justify-end items-center focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}>

            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <ButtonSubmit href={buttonSubmitHref} />
              </div>
            )}
          </div>
        </>
      )}
    </Popover>
  );
};

export default SearchButton;
